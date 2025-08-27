
import React from 'react';
import { DashboardIcon } from './icons/DashboardIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { InvoiceIcon } from './icons/InvoiceIcon';
import { SupportIcon } from './icons/SupportIcon';


const ClientSidebar: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
    const navItems = [
        { href: '#/client/dashboard', label: 'لوحة التحكم', icon: <DashboardIcon /> },
        { href: '#/client/projects', label: 'مشاريعي', icon: <ProjectIcon /> },
        { href: '#/client/invoices', label: 'فواتيري', icon: <InvoiceIcon /> },
        { href: '#/client/support', label: 'الدعم الفني', icon: <SupportIcon /> },
    ];
    
    return (
        <aside className="w-64 bg-white border-l border-slate-200 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-8 px-2">
                <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-8 h-8" />
                <span className="text-lg font-bold text-slate-800">بوابة العميل</span>
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => {
                    const isActive = currentRoute === item.href;
                    return (
                        <a 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <span className="w-5 h-5">{item.icon}</span>
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <a 
                    href="#/" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>تسجيل الخروج</span>
                </a>
            </div>
        </aside>
    );
};

export default ClientSidebar;
