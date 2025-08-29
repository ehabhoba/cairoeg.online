import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'green' | 'gray' | 'blue' | 'red' | 'yellow';
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
  const colorClasses = {
    green: 'bg-green-500/10 text-green-400 border border-green-500/20',
    gray: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  };

   const dotColorClasses = {
    green: 'bg-green-400',
    gray: 'bg-slate-400',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorClasses[color]}`}>
       <span className={`h-2 w-2 mr-1.5 rounded-full ${dotColorClasses[color]}`}></span>
      {children}
    </span>
  );
};

export default Badge;