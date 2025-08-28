
import React from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { TiktokIcon } from './icons/TiktokIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';

const Footer: React.FC = () => {
    const quickLinks = [
        { href: "#/", label: "الرئيسية" },
        { href: "#/about", label: "من نحن" },
        { href: "#/services/marketing", label: "الخدمات" },
        { href: "#/portfolio", label: "أعمالنا" },
        { href: "#/blog", label: "المدونة" },
        { href: "#/contact", label: "تواصل معنا" },
    ];

    const socialLinks = [
        { href: "https://wa.me/201022679250", icon: <WhatsappIcon className="w-5 h-5" /> },
        { href: "https://www.facebook.com/cairoeg.online", icon: <FacebookIcon className="w-5 h-5" /> },
        { href: "#", icon: <InstagramIcon className="w-5 h-5" /> },
        { href: "#", icon: <TiktokIcon className="w-5 h-5" /> },
        { href: "#", icon: <LinkedInIcon className="w-5 h-5" /> },
    ];

    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
            <div className="max-w-7xl mx-auto py-12 px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="md:col-span-1">
                        <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-32 mb-4" />
                        <p className="text-sm leading-relaxed">
                            وكالة تسويق رقمي متكاملة في القاهرة، متخصصة في مساعدة الشركات على تحقيق أهدافها من خلال حلول إعلانية وإبداعية مبتكرة.
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
                    
                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-white mb-4">بيانات التواصل</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <span className="ml-2 mt-1">&#9993;</span>
                                <a href="mailto:cairoeg.ads@gmail.com" className="hover:text-primary">cairoeg.ads@gmail.com</a>
                            </li>
                            <li className="flex items-start">
                                <span className="ml-2 mt-1">&#9742;</span>
                                <div>
                                    <a href="tel:+201022679250" className="hover:text-primary">01022679250</a><br/>
                                    <a href="tel:+201140057253" className="hover:text-primary">01140057253</a>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="ml-2 mt-1">&#128205;</span>
                                <span>القاهرة, مصر</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                     <div>
                        <h3 className="font-bold text-white mb-4">تابعنا</h3>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((link, i) => (
                                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full hover:bg-primary hover:text-white transition-all">
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة إعلانات القاهرة (Cairoeg).</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
