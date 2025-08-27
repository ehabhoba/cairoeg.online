
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';
import { StopIcon } from './icons/StopIcon';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onStopGenerating: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onStopGenerating }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  const suggestions = [
      "ما هي التوصيات لزيادة الإيرادات؟",
      "كيف يمكنني تحسين معدل التحويل؟",
      "من هم العملاء الأكثر ربحية؟",
      "ما هو أداء الحملات هذا الشهر؟",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-white/60 backdrop-blur-lg border-t border-gray-200 rounded-b-2xl">
       <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s, i) => (
                <button 
                    key={i} 
                    onClick={() => handleSuggestionClick(s)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                    {s}
                </button>
            ))}
        </div>
      <form onSubmit={handleSubmit} className="flex items-start gap-3 relative">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اسأل المساعد الذكي عن أي شيء..."
          className="w-full py-3 pr-5 pl-14 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none max-h-40 overflow-y-auto"
          disabled={isLoading}
        />
        {isLoading ? (
            <button
                type="button"
                onClick={onStopGenerating}
                className="absolute left-2 top-2 p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Stop generating"
            >
                <StopIcon className="w-5 h-5" />
            </button>
        ) : (
            <button
                type="submit"
                disabled={!text.trim()}
                className="absolute left-2 top-2 p-2.5 bg-slate-700 text-white rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
                aria-label="Send message"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
