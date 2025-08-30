
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { markOnboardingComplete } from '../data/userData';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XIcon } from './icons/XIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface OnboardingChecklistProps {
    onNavigate: (path: string) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ onNavigate }) => {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([
        { id: 1, text: 'إكمال ملفك الشخصي وبيانات الشركة', completed: !!(currentUser?.companyName), link: '/client/profile' },
        { id: 2, text: 'إضافة روابط التواصل الاجتماعي', completed: !!(currentUser?.facebookUrl || currentUser?.instagramHandle), link: '/client/profile' },
        { id: 3, text: 'تقديم أول طلب خدمة (تصميم أو حملة)', completed: false, link: '/client/requests' },
    ]);

    return (
        <div className="mt-6 space-y-4">
            {tasks.map(task => (
                <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg ${task.completed ? 'bg-green-500/10 text-green-300' : 'bg-slate-700/50'}`}>
                    <div className="flex items-center">
                        <CheckCircleIcon className={`w-6 h-6 ml-3 ${task.completed ? 'text-green-400' : 'text-slate-500'}`} />
                        <span>{task.text}</span>
                    </div>
                    {!task.completed && (
                        <button onClick={() => onNavigate(task.link)} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-light">
                            <span>ابدأ الآن</span>
                            <ArrowLeftIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};


interface ClientOnboardingProps {
    onDismiss: () => void;
    onNavigate: (path: string) => void;
}

const ClientOnboarding: React.FC<ClientOnboardingProps> = ({ onDismiss, onNavigate }) => {
    const { currentUser } = useAuth();
    const addNotification = useNotification();

    const handleDismiss = async () => {
        if (!currentUser) return;
        try {
            await markOnboardingComplete(currentUser.id);
            onDismiss();
            addNotification('مرحباً بك!', 'يمكنك دائماً الوصول لهذه الصفحات من القائمة الجانبية.', 'info');
        } catch (error) {
            addNotification('خطأ', 'لم نتمكن من حفظ تفضيلاتك، قد تظهر هذه الرسالة مجدداً.', 'error');
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-panel-bg text-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 m-4 p-8 relative animate-modal-enter">
                 <button onClick={handleDismiss} className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-bold text-white">مرحباً بك في منصة إعلانات القاهرة!</h2>
                <p className="mt-2 text-slate-400">يسعدنا انضمامك إلينا. لنبدأ بتجهيز حسابك لتحقيق أفضل النتائج.</p>
                <OnboardingChecklist onNavigate={onNavigate} />
                <div className="mt-8 flex justify-end">
                    <button onClick={handleDismiss} className="text-sm text-slate-400 hover:text-white">تخطي في الوقت الحالي</button>
                </div>
            </div>
        </div>
    );
};

export default ClientOnboarding;
