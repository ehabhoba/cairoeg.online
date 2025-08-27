
import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block cursor-pointer border-b border-dashed border-slate-500"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-900 text-white text-xs rounded-md shadow-lg z-10 border border-slate-700 animate-fade-in">
          {text}
           <div className="absolute top-full right-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};

export default Tooltip;
