
import React, { useState } from 'react';
import { type Message } from '../types';
import { UserIcon } from './icons/UserIcon';
import { GeminiIcon } from './icons/GeminiIcon';
import { CopyIcon } from './icons/CopyIcon';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
    : message.isError 
    ? 'bg-red-50 text-red-700 rounded-r-2xl rounded-tl-2xl border border-red-200'
    : 'bg-slate-100 text-slate-800 rounded-r-2xl rounded-tl-2xl';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  
  const Avatar = () => (
    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${isUser ? 'bg-slate-300 ml-3' : 'bg-slate-200 mr-3'}`}>
      {isUser ? <UserIcon className="w-5 h-5 text-slate-600" /> : <GeminiIcon className="w-5 h-5 text-slate-700" />}
    </div>
  );

  return (
    <div className={`group flex items-start ${containerClasses} fade-in`}>
      {!isUser && <Avatar />}
      <div className={`relative max-w-2xl px-5 py-3 ${bubbleClasses} shadow-sm`}>
        {/* Render a blinking cursor if the model message is empty during streaming start */}
        {message.role === 'model' && !message.text && !message.isError ? (
            <span className="animate-pulse">▍</span>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        )}
        {!isUser && !message.isError && message.text && (
           <button 
                onClick={handleCopy}
                className="absolute top-2 -left-10 p-1.5 bg-slate-100 text-slate-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200"
                aria-label="Copy message"
            >
                {copied ? <span className="text-xs px-1">تم النسخ!</span> : <CopyIcon className="w-4 h-4" />}
            </button>
        )}
      </div>
      {isUser && <Avatar />}
    </div>
  );
};

export default MessageBubble;
