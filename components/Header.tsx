import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">المساعد الذكي للمنصة</h1>
            <p className="text-sm text-slate-500">مساعد ذكي متخصص في إدارة منصة الأعمال ومساعدة المدير في جميع المهام</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>متصل</span>
            <span className="text-slate-300">|</span>
            <span>Gemini Flash 2.0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;