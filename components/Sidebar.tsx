
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon } from './icons/HomeIcon';
import { CustomersIcon } from './icons/CustomersIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { AssistantIcon } from './icons/AssistantIcon';
import NotificationBell from './NotificationBell';

const Sidebar: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
    const { logout, currentUser } = useAuth();
    const navItems = [
        { href: '/dashboard/overview', label: 'نظرة عامة', icon: <HomeIcon /> },
        { href: '/dashboard/clients', label: 'العملاء', icon: <CustomersIcon /> },
        { href: '/dashboard/assistant', label: 'المساعد الذكي', icon: <AssistantIcon /> },
        { href: '/dashboard/requests', label: 'إدارة الطلبات', icon: <ClipboardDocumentListIcon /> },
        { href: '/dashboard/articles', label: 'إدارة المقالات', icon: <DocumentTextIcon /> },
        { href: '/dashboard/comments', label: 'إدارة التعليقات', icon: <ChatBubbleLeftRightIcon /> },
        { href: '/dashboard/aistudio', label: 'استوديو AI', icon: <SparklesIcon /> },
        { href: '/dashboard/content-automator', label: 'أتمتة المحتوى', icon: <SparklesIcon /> },
    ];
    
    return (
        <aside className="w-64 bg-panel-bg p-4 flex flex-col border-l border-slate-100/10">
             <div className="flex items-center justify-between gap-2 mb-8 px-2">
                <a href="/dashboard/overview" className="flex items-center gap-2">
                    <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-8 h-8 filter brightness-0 invert" />
                    <span className="text-lg font-bold text-white">لوحة التحكم</span>
                </a>
                {currentUser && <NotificationBell userPhone={currentUser.phone} userRole='admin' />}
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => {
                    const isActive = currentRoute.startsWith(item.href);
                    return (
                        <a 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                isActive 
                                ? 'bg-primary text-white shadow-sm' 
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className="w-5 h-5">{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <button 
                    onClick={logout} 
                    className="flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
