import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { TiktokIcon } from './icons/TiktokIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';

const Footer: React.FC = () => {
    const quickLinks = [
        { href: "/about", label: "من نحن" },
        { href: "/services", label: "الخدمات" },
        { href: "/portfolio", label: "أعمالنا" },
        { href: "/blog", label: "المدونة" },
    ];
    
    const supportLinks = [
        { href: "/contact", label: "تواصل معنا" },
        { href: "/payments", label: "طرق الدفع" },
        { href: "/guide", label: "دليل المنصة" },
        { href: "/terms", label: "شروط الخدمة" },
        { href: "/privacy", label: "سياسة الخصوصية" },
    ];

    const socialLinks = [
        { href: "https://wa.me/201022679250", icon: <WhatsappIcon className="w-5 h-5" />, name: "WhatsApp" },
        { href: "https://www.facebook.com/cairoeg.online", icon: <FacebookIcon className="w-5 h-5" />, name: "Facebook" },
        { href: "https://www.instagram.com/cairoeg.online", icon: <InstagramIcon className="w-5 h-5" />, name: "Instagram" },
        { href: "https://www.tiktok.com/@cairoeg.online", icon: <TiktokIcon className="w-5 h-5" />, name: "TikTok" },
        { href: "https://www.linkedin.com/company/cairoeg-online", icon: <LinkedInIcon className="w-5 h-5" />, name: "LinkedIn" },
    ];

    return (
        <footer className="bg-light-bg border-t border-slate-100/10 text-slate-400">
            <div className="max-w-7xl mx-auto py-16 px-4 lg:px-6">
                 {/* Newsletter and Socials */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-10 mb-10 border-b border-slate-100/10">
                     <div className="text-center md:text-right">
                        <h3 className="text-2xl font-bold text-white">انضم إلى قائمتنا البريدية</h3>
                        <p>احصل على أحدث الرؤى والاستراتيجيات في التسويق الرقمي مباشرة إلى بريدك.</p>
                     </div>
                     <form className="w-full max-w-md flex gap-2">
                        <input type="email" placeholder="أدخل بريدك الإلكتروني" className="flex-grow px-4 py-3 bg-dark-bg border border-slate-100/20 text-white rounded-xl focus:ring-primary focus:border-primary" />
                        <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">اشترك</button>
                     </form>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-2 md:col-span-1">
                        <a href="/">
                            <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-24 mb-4" />
                        </a>
                        <p className="text-sm leading-relaxed pr-2">
                            محرك إعلاني ذكي يساعد الشركات على تحقيق أهدافها من خلال حلول إعلانية وإبداعية مبتكرة.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">روابط سريعة</h3>
                        <ul className="space-y-2">
                            {quickLinks.map(link => (
                                <li key={link.href}>
                                    <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Support Links */}
                    <div>
                        <h3 className="font-bold text-white mb-4">الدعم</h3>
                        <ul className="space-y-2">
                            {supportLinks.map(link => (
                                <li key={link.href}>
                                    <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Contact Info */}
                     <div>
                        <h3 className="font-bold text-white mb-4">بيانات التواصل</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <a href="mailto:cairoeg.ads@gmail.com" className="hover:text-primary">cairoeg.ads@gmail.com</a>
                            </li>
                            <li className="flex items-start">
                               <a href="tel:+201022679250" className="hover:text-primary" dir="ltr">+20 102 267 9250</a>
                            </li>
                            <li className="flex items-start">
                                <span>القاهرة, مصر</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100/10 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة إعلانات القاهرة (Cairoeg).</p>
                     <div className="flex items-center gap-3 mt-4 sm:mt-0">
                        {socialLinks.map((link, i) => (
                            <a 
                                key={i} 
                                href={link.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-9 h-9 flex items-center justify-center bg-dark-bg rounded-full hover:bg-primary hover:text-white transition-all"
                                aria-label={`تابعنا على ${link.name}`}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;