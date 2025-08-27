import React from 'react';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { NewChatIcon } from './icons/NewChatIcon';

interface ActionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon, title, description, onClick, disabled }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className="flex items-start text-right w-full p-3 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={`Action: ${title}`}
  >
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg ml-4">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </button>
);

interface QuickActionsProps {
    onActionClick: (prompt: string) => void;
    isLoading: boolean;
    onNewChat: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick, isLoading, onNewChat }) => {
    const actions = [
        { icon: <ChartBarIcon />, title: "تحليل حملة فيسبوك", description: "احصل على تحليل لأداء حملة إعلانية", prompt: "قم بتحليل أداء حملة فيسبوك الأخيرة مع التركيز على نسبة النقر إلى الظهور والتكلفة لكل نتيجة." },
        { icon: <LightBulbIcon />, title: "أفكار إعلانية جديدة", description: "اقتراح 3 أفكار إعلانية لمشروعك", prompt: "اقترح لي 3 أفكار إعلانية جديدة ومبتكرة لمنتج ملابس شبابية على تيك توك." },
        { icon: <MegaphoneIcon />, title: "مقارنة أداء المنصات", description: "مقارنة بين فيسبوك وجوجل", prompt: "ما هي المنصة الإعلانية الأفضل لمركز طبي في القاهرة، إعلانات فيسبوك أم إعلانات جوجل؟ ولماذا؟" },
        { icon: <DocumentTextIcon />, title: "تقرير الإنفاق الإعلاني", description: "ملخص الإنفاق على الإعلانات", prompt: "أنشئ لي تقريرًا عن إجمالي الإنفاق الإعلاني لهذا الشهر، مقسمًا حسب كل منصة." },
        { icon: <UsersIcon />, title: "تحسين صفحة الهبوط", description: "اقتراحات لزيادة تحويلات الصفحة", prompt: "ما هي اقتراحاتك لتحسين صفحة الهبوط الخاصة بمنتجنا لزيادة معدل التحويل؟" },
        { icon: <CalendarIcon />, title: "خطة محتوى أسبوعية", description: "جدول أفكار محتوى للسوشيال ميديا", prompt: "ضع لي خطة محتوى بسيطة لمدة أسبوع لحساب انستغرام مختص بالتسويق الرقمي." },
    ];

  return (
    <div className="bg-white h-full p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold">الإجراءات السريعة</h2>
        <button 
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Start new chat"
        >
            <NewChatIcon className="w-4 h-4" />
            <span>محادثة جديدة</span>
        </button>
      </div>
      <div className="space-y-2 flex-1 overflow-y-auto">
        {actions.map((action, i) => (
            <ActionItem 
                key={i} 
                icon={action.icon}
                title={action.title}
                description={action.description}
                onClick={() => onActionClick(action.prompt)}
                disabled={isLoading}
            />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;