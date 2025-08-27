import React, { useRef, useEffect } from 'react';
import { type Message } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onStopGenerating: () => void;
  isInitialState: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, onStopGenerating, isInitialState }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // A slight delay before scrolling allows the new message to render and animation to start
    const timer = setTimeout(() => {
        scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white shadow-sm rounded-2xl border border-gray-200">
       <div className="p-4 border-b border-gray-200 flex justify-between items-center">
         <div>
            <h1 className="text-xl font-bold text-slate-800">المساعد الإعلاني الذكي</h1>
            <p className="text-sm text-slate-500">مساعد متخصص في تحليل واقتراح الحملات الإعلانية</p>
         </div>
         <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>متصل</span>
            <span className="text-slate-300">|</span>
            <span>Gemini 2.5 Flash</span>
        </div>
       </div>
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        {isInitialState ? (
          <WelcomeMessage onSuggestionClick={onSendMessage} />
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} onStopGenerating={onStopGenerating} />
    </div>
  );
};

export default ChatWindow;