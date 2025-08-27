
import React, { useState, useEffect, useRef } from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface NavLink {
    href: string;
    label: string;
    children?: NavLink[];
}

const NavItem: React.FC<{ link: NavLink; isActive?: boolean; onClick?: () => void; }> = ({ link, isActive, onClick }) => (
    <a href={link.href} onClick={onClick} className={`block px-3 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
        {link.label}
    </a>
);

const TopNav: React.FC<{ currentRoute: string }> = ({ currentRoute }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
    const servicesMenuRef = useRef<HTMLDivElement>(null);

    const navLinks: NavLink[] = [
        { href: "#/", label: "الرئيسية" },
        { 
            href: "#/services", 
            label: "الخدمات",
            children: [
                { href: "#/services/marketing", label: "التسويق الرقمي والإعلانات" },
                { href: "#/services/graphic-design", label: "التصميم الجرافيكي والهوية" },
                { href: "#/services/web-design", label: "تصميم المواقع والمتاجر" },
            ]
        },
        { href: "#/pricing", label: "الباقات" },
        { href: "#/portfolio", label: "أعمالنا" },
        { href: "#/blog", label: "المدونة" },
        { href: "#/about", label: "من نحن" },
        { href: "#/payments", label: "طرق الدفع" },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
                setIsServicesMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLinkClick = () => setIsMenuOpen(false);

    return (
        <header className="bg-dark-bg/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4 md:gap-8">
                        <a href="#/" className="flex items-center gap-2">
                            <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-8 h-8 filter brightness-0 invert" />
                            <span className="text-lg font-bold text-white hidden sm:block">إعلانات القاهرة</span>
                        </a>
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                link.children ? (
                                    <div key={link.label} className="relative" ref={servicesMenuRef}>
                                        <button 
                                            onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                                            className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${currentRoute.startsWith('#/services') ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                        >
                                            <span>{link.label}</span>
                                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div className={`absolute top-full right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden transition-all duration-200 ease-out origin-top ${isServicesMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                            {link.children.map(child => (
                                                <a key={child.href} href={child.href} onClick={() => setIsServicesMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white">{child.label}</a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <NavItem key={link.href} link={link} isActive={currentRoute === link.href} />
                                )
                            ))}
                        </nav>
                    </div>
                     <div className="flex items-center gap-2">
                        <a href="#/login" className="hidden sm:inline-block px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-xl shadow-sm hover:bg-slate-600 transition-all">
                            تسجيل الدخول
                        </a>
                        <a href="#/contact" className="hidden sm:inline-block px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl shadow-sm hover:bg-primary/90 hover:scale-105 transition-all">
                            اطلب استشارة
                        </a>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-300 rounded-md hover:bg-white/10">
                                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-dark-bg/95 backdrop-blur-lg border-t border-slate-700/50">
                    <nav className="px-2 pt-2 pb-4 space-y-1">
                         {navLinks.map(link => (
                            link.children ? (
                                <div key={link.label}>
                                    <span className="block px-3 py-2 text-sm font-bold text-slate-500">{link.label}</span>
                                    {link.children.map(child => (
                                        <a key={child.href} href={child.href} onClick={handleLinkClick} className="block pl-6 pr-3 py-2 text-sm font-semibold text-slate-300 rounded-md hover:bg-white/10">{child.label}</a>
                                    ))}
                                </div>
                            ) : (
                                <NavItem key={link.href} link={link} isActive={currentRoute === link.href} onClick={handleLinkClick} />
                            )
                        ))}
                         <div className="px-3 pt-4 flex flex-col gap-3">
                             <a href="#/contact" className="block w-full text-center px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl shadow-sm hover:bg-primary/90 transition-all">
                                اطلب استشارة
                            </a>
                             <a href="#/login" className="block w-full text-center px-4 py-2 text-sm font-semibold bg-slate-700 text-white rounded-xl shadow-sm hover:bg-slate-600 transition-all">
                                تسجيل الدخول
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default TopNav;
