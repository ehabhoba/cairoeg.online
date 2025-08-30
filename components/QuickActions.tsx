
import React from 'react';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { NewChatIcon } from './icons/NewChatIcon';
import { ProjectIcon } from './icons/ProjectIcon';

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
    userRole: 'admin' | 'client';
}

const adminActions = [
    { icon: <ChartBarIcon />, title: "تحليل أداء الحملات", description: "احصل على تحليل لأداء حملات هذا الشهر", prompt: "قم بتحليل أداء الحملات الإعلانية لهذا الشهر وقدم ملخصاً للنتائج الرئيسية والتوصيات." },
    { icon: <LightBulbIcon />, title: "أفكار محتوى للمدونة", description: "اقتراح 3 أفكار مقالات جديدة", prompt: "اقترح لي 3 أفكار مقالات جديدة ومبتكرة لمدونة الوكالة حول التسويق الرقمي." },
    { icon: <MegaphoneIcon />, title: "مقارنة أداء المنصات", description: "مقارنة بين فيسبوك وجوجل لعميل", prompt: "ما هي المنصة الإعلانية الأفضل لعيادة أسنان في القاهرة، إعلانات فيسبوك أم إعلانات جوجل؟ ولماذا؟" },
    { icon: <DocumentTextIcon />, title: "إنشاء تقرير عميل", description: "ملخص أداء لعميل محدد", prompt: "أنشئ لي مسودة تقرير أداء شهري للعميل 'شركة التجارة الحديثة' مع التركيز على نمو المبيعات." },
    { icon: <UsersIcon />, title: "تحليل سلوك العملاء", description: "فهم أفضل لشرائح العملاء", prompt: "بناءً على بياناتنا، ما هي الخصائص الديموغرافية لأكثر شريحة عملاء تفاعلاً مع خدماتنا؟" },
];

const clientActions = [
    { icon: <LightBulbIcon />, title: "فكرة إعلانية جديدة", description: "احصل على فكرة مبتكرة لمشروعك", prompt: "اقترح فكرة حملة إعلانية جديدة لمتجر ملابس يستهدف الشباب على انستغرام." },
    { icon: <DocumentTextIcon />, title: "كتابة منشور سوشيال ميديا", description: "احصل على نص لمنشورك القادم", prompt: "اكتب لي نصاً قصيراً وجذاباً لمنشور على فيسبوك حول خصومات نهاية الأسبوع على منتجاتنا." },
    { icon: <ProjectIcon />, title: "استفسار عن مشروعي", description: "اسأل عن حالة مشروعك الحالي", prompt: "ما هي آخر التطورات في مشروع تصميم المتجر الإلكتروني الخاص بي؟" },
    { icon: <ChartBarIcon />, title: "فهم تقرير الأداء", description: "اطلب شرحاً مبسطاً لتقريرك", prompt: "اشرح لي ببساطة ماذا يعني مصطلح 'معدل التحويل' (Conversion Rate) في تقريري الأخير." },
];


const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick, isLoading, onNewChat, userRole }) => {
    const actions = userRole === 'admin' ? adminActions : clientActions;

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
