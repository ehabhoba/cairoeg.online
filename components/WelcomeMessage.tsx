

import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface WelcomeMessageProps {
    onSuggestionClick: (prompt: string) => void;
}

const WelcomeSuggestion: React.FC<{icon: React.ReactNode, title: string, prompt: string, onClick: (prompt: string) => void}> = ({ icon, title, prompt, onClick }) => (
    <button onClick={() => onClick(prompt)} className="p-4 border border-slate-200 rounded-xl text-right hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div className="w-8 h-8 flex items-center justify-center text-slate-600 mb-2">
            {icon}
        </div>
        <h3 className="font-bold text-slate-800">{title}</h3>
    </button>
);


const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSuggestionClick }) => {
    const suggestions = [
        { icon: <ChartBarIcon className="w-8 h-8" />, title: "تحليل أداء الحملات", prompt: "قم بتحليل أداء حملة فيسبوك الأخيرة وقدم ملخصاً للنتائج الرئيسية." },
        { icon: <MegaphoneIcon className="w-8 h-8" />, title: "اقتراح حملة جديدة", prompt: "اقترح فكرة حملة إعلانية جديدة لمتجر ملابس يستهدف الشباب على انستغرام." },
        { icon: <UsersIcon className="w-8 h-8" />, title: "أفضل الكلمات المفتاحية", prompt: "ما هي أفضل الكلمات المفتاحية التي يجب استهدافها في إعلانات جوجل لعيادة أسنان في القاهرة؟" },
    ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl mb-4">
        <BrainCircuitIcon className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">المساعد الإعلاني الذكي</h1>
      <p className="text-slate-500 max-w-lg mb-8">
        أهلاً بك! أنا هنا لمساعدتك في تحليل أداء حملاتك، اقتراح أفكار إعلانية، وتقديم رؤى استراتيجية. كيف يمكنني خدمتك اليوم؟
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {suggestions.map((s, i) => (
            <WelcomeSuggestion 
                key={i}
                icon={s.icon}
                title={s.title}
                prompt={s.prompt}
                onClick={onSuggestionClick}
            />
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessage;