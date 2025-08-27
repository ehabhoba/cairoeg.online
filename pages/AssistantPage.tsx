import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import QuickActions from '../components/QuickActions';
import ConfirmationModal from '../components/ConfirmationModal';
import { type Message } from '../types';
import { ai, SYSTEM_INSTRUCTION } from '../services/geminiService';
import type { Chat } from '@google/genai';

const CHAT_HISTORY_KEY = 'gemini-smart-organizer-chat-history';

const initialMessage: Message = {
  role: 'model',
  text: "مرحباً! أنا 'مساعد القاهرة الإعلاني'. يمكنني مساعدتك في تحليل أداء حملاتك، اقتراح أفكار إعلانية جديدة، وإنشاء تقارير. كيف يمكنني دعم نجاحك الرقمي اليوم؟",
};

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to initialize or re-initialize the chat session
  const initializeChat = useCallback((currentMessages: Message[]) => {
    if (ai) {
      // Filter out the initial welcome message if it's the only one, so history starts clean
      const history = (currentMessages.length === 1 && currentMessages[0].text === initialMessage.text) 
        ? [] 
        : currentMessages
            .filter(msg => !msg.isError && msg.text) // Don't include error or empty messages
            .map(msg => ({
              role: msg.role,
              parts: [{ text: msg.text }]
            }));

      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION },
        history: history,
      });
    } else {
       if (messages.length === 0) { // Avoid setting error message on every re-render if AI is null
        setMessages([{ role: 'model', text: "عفواً، يوجد خطأ في الإعدادات. برجاء مراجعة مفتاح الواجهة البرمجية.", isError: true }]);
       }
    }
  }, [messages.length]);

  // Load chat from localStorage on first load
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedMessages && savedMessages.length > 2) { // Check for more than empty array "[]"
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      setMessages([initialMessage]);
    }
  }, []);

  // Initialize chat whenever messages are loaded or changed fundamentally
  useEffect(() => {
    if (messages.length > 0) {
      initializeChat(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length === 1]); // Re-init only when starting new chat or loading first time

  // Save chat to localStorage whenever it updates
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleNewChatRequest = useCallback(() => {
    // If there's more than the initial message, ask for confirmation
    if (messages.length > 1) {
      setIsNewChatModalOpen(true);
    } else {
      // Otherwise, just start a new one
      confirmNewChat();
    }
  }, [messages.length]);
  
  const confirmNewChat = useCallback(() => {
    if (isLoading) {
      abortControllerRef.current?.abort();
    }
    const newMessages = [initialMessage];
    setMessages(newMessages);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    initializeChat(newMessages);
    setIsNewChatModalOpen(false);
  }, [isLoading, initializeChat]);

  const handleStopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading) return;
    
    // If this is the first user message, re-initialize chat without the welcome message in history
    if (messages.length === 1 && messages[0].text === initialMessage.text) {
        initializeChat([]); 
    }
    if(!chatRef.current) {
        console.error("Chat not initialized.");
        return;
    }


    abortControllerRef.current = new AbortController();
    const newUserMessage: Message = { role: 'user', text: inputText };
    
    // Replace initial message if it's the first message, otherwise append
    const currentMessages = messages.length === 1 && messages[0] === initialMessage 
      ? [newUserMessage] 
      : [...messages, newUserMessage];

    setMessages(currentMessages);
    setIsLoading(true);

    // Add an empty model message to stream into
    setMessages((prev) => [...prev, { role: 'model', text: '' }]);

    const handleAbort = () => {
        setIsLoading(false);
        setMessages(prev => {
            let finalMessages = [...prev];
            const lastMessage = finalMessages[finalMessages.length - 1];
            if (lastMessage && lastMessage.role === 'model' && lastMessage.text.trim() === '') {
                 finalMessages.pop(); // Remove the empty placeholder
            }
            initializeChat(finalMessages); // Re-sync history after abort
            return finalMessages;
        });
    };

    try {
      const stream = await chatRef.current.sendMessageStream({ message: inputText });

      let accumulatedText = "";
      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) {
          handleAbort();
          break;
        }
        accumulatedText += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = accumulatedText;
          return newMessages;
        });
      }
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log("Stream stopped by user.");
            handleAbort();
        } else {
            console.error("Error during streaming:", error);
            const errorMessage: Message = {
              role: 'model',
              text: 'عفواً، حدث خطأ أثناء التواصل مع المساعد. برجاء المحاولة مرة أخرى.',
              isError: true,
            };
            // Replace the empty streaming message with the error message
            setMessages((prev) => {
                const newMessages = prev.slice(0, -1);
                return [...newMessages, errorMessage];
            });
        }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, initializeChat, messages]);

  return (
    <>
      <main className="flex-1 overflow-hidden p-4 lg:p-6 bg-slate-100">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full overflow-y-auto">
             <QuickActions onActionClick={handleSendMessage} isLoading={isLoading} onNewChat={handleNewChatRequest} />
          </div>
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-full">
            <ChatWindow 
              messages={messages} 
              isLoading={isLoading} 
              onSendMessage={handleSendMessage}
              onStopGenerating={handleStopGenerating}
              isInitialState={messages.length === 1 && messages[0] === initialMessage}
            />
          </div>
        </div>
      </main>
      <ConfirmationModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onConfirm={confirmNewChat}
        title="بدء محادثة جديدة"
        description="هل أنت متأكد أنك تريد بدء محادثة جديدة؟ سيتم حذف سجل المحادثة الحالي نهائياً."
      />
    </>
  );
};

export default AssistantPage;