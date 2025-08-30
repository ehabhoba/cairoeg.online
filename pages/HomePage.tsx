import React, { useState, useEffect, useRef } from 'react';
import { testimonials, faqItems, services } from '../data/siteData';
import { PaintBrushIcon } from '../components/icons/PaintBrushIcon';
import { MegaphoneIcon } from '../components/icons/MegaphoneIcon';
import { CodeBracketIcon } from '../components/icons/CodeBracketIcon';
import { GlobeIcon } from '../components/icons/GlobeIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';
import SpotlightCard from '../components/SpotlightCard';
import AdBanner from '../components/AdBanner';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { MinusCircleIcon } from '../components/icons/MinusCircleIcon';
import { KeyIcon } from '../components/icons/KeyIcon';
import { AssistantIcon } from '../components/icons/AssistantIcon';
import { ProjectIcon } from '../components/icons/ProjectIcon';
import { PortfolioIcon } from '../components/icons/PortfolioIcon';

const iconMap: { [key: string]: React.ReactNode } = {
    'ads': <MegaphoneIcon />,
    'design': <PaintBrushIcon />,
    'dev': <CodeBracketIcon />,
    'seo': <GlobeIcon />,
    'creation': <RocketLaunchIcon />,
};

const AnimatedCounter: React.FC<{ end: number, duration?: number }> = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const startTime = performance.now();
                    const animate = (currentTime: number) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        setCount(Math.floor(progress * end));
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
};

const TestimonialCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isHoveringRef = useRef(false);

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        const nextSlide = () => {
            if (!isHoveringRef.current) {
                setCurrentIndex((prevIndex) =>
                    prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
                );
            }
        };
        intervalRef.current = setInterval(nextSlide, 5000);
        return () => resetInterval();
    }, []);

    const handleMouseEnter = () => { isHoveringRef.current = true; };
    const handleMouseLeave = () => { isHoveringRef.current = false; };
    
    return (
        <div 
            className="relative w-full max-w-4xl mx-auto h-64 overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {testimonials.map((testimonial, index) => (
                <div
                    key={testimonial.id}
                    className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                    style={{ opacity: index === currentIndex ? 1 : 0 }}
                >
                    <div className="bg-light-bg/50 p-8 rounded-2xl border border-slate-100/10 text-center h-full flex flex-col justify-center">
                        <p className="text-slate-300 mb-6 italic text-lg">"{testimonial.quote}"</p>
                        <div className="flex items-center justify-center">
                            <div className="ml-4">
                                <p className="font-bold text-white">{testimonial.name}</p>
                                <p className="text-sm text-primary">{testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const HomePage: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const serviceLinks: { [id: string]: string } = {
        'ads': '/services/marketing',
        'creation': '/services/ad-creation',
        'design': '/services/graphic-design',
        'dev': '/services/web-design',
        'seo': '/services/marketing',
    };

    const platformFeatures = [
        { icon: <AssistantIcon className="w-8 h-8" />, title: "المساعد الذكي", description: "استخدم قوة الذكاء الاصطناعي لاقتراح أفكار إعلانية، كتابة المحتوى، وتحليل الأداء." },
        { icon: <ProjectIcon className="w-8 h-8" />, title: "بوابة العميل التفاعلية", description: "تابع مشاريعك، تواصل مع الفريق، وادفع فواتيرك من مكان واحد منظم وآمن." },
        { icon: <MegaphoneIcon className="w-8 h-8" />, title: "نظام إعلانات متكامل", description: "انشر إعلاناتك مجاناً أو اختر الباقات المدفوعة للوصول إلى جمهور أوسع داخل المنصة." },
        { icon: <PortfolioIcon className="w-8 h-8" />, title: "معرض أعمال ديناميكي", description: "تلقائياً، يتم عرض أعمالك المنجزة في معرض أعمالنا، مما يعزز من علامتك التجارية." }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative hero-gradient text-center py-24 px-4 sm:py-32 overflow-hidden">
                 <div className="absolute inset-0 bg-dark-bg/50"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:20px_20px] animate-pulse"></div>

                 <div className="relative z-10 max-w-4xl mx-auto">
                    <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-40 md:w-48 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        إعلانات القاهرة: محرك إعلاني ذكي لنمو أعمالك
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        نساعد الشركات في الوصول لجمهورهم عبر الإنترنت، من خلال الإعلانات الممولة، المقالات المحسّنة، وصفحات العرض الخاصة.
                    </p>
                    <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <a href="/contact" className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:scale-105">
                            اطلب استشارة مجانية
                        </a>
                        <a href="/portfolio" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl shadow-lg hover:bg-white/20 transition-all transform hover:scale-105">
                            شاهد أعمالنا
                        </a>
                    </div>
                </div>
            </section>

             {/* Ad Banner */}
            <AdBanner />

            {/* Platform Features Section */}
            <section id="features" className="py-20 px-4 lg:px-6 animate-slide-in-up">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">منصة متكاملة لإدارة وتسويق أعمالك</h2>
                    <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">كل ما تحتاجه للنجاح الرقمي، في مكان واحد.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {platformFeatures.map(feature => (
                             <div key={feature.title} className="bg-light-bg/50 p-6 rounded-2xl border border-slate-100/10 text-center">
                                 <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-primary/20 text-primary rounded-xl">
                                    {feature.icon}
                                 </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Our Numbers Section */}
            <section className="py-20 px-4 lg:px-6 bg-light-bg border-y border-slate-100/10 animate-slide-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold text-primary"><AnimatedCounter end={150} />+</div>
                        <p className="text-slate-400 mt-2">مشروع ناجح</p>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold text-primary"><AnimatedCounter end={95} />%</div>
                        <p className="text-slate-400 mt-2">رضا العملاء</p>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold text-primary"><AnimatedCounter end={200} />%</div>
                        <p className="text-slate-400 mt-2">متوسط نمو الإيرادات</p>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-extrabold text-primary"><AnimatedCounter end={10} />+</div>
                        <p className="text-slate-400 mt-2">سنوات من الخبرة</p>
                    </div>
                </div>
            </section>

             {/* Publish Article CTA */}
            <section className="py-20 px-4 text-center bg-dark-bg">
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">شارك خبرتك مع مجتمعنا</h2>
                 <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                     هل لديك قصة نجاح، نصيحة تسويقية، أو رؤية تود مشاركتها؟ انشر مقالتك على مدونتنا مجاناً وساهم في إثراء المحتوى العربي.
                 </p>
                 <a href="/publish-article" className="inline-block px-8 py-3 bg-gold text-dark-bg font-bold rounded-xl shadow-lg hover:bg-gold/90 transition-all transform hover:scale-105">
                     + انشر مقالتك الآن
                 </a>
            </section>


             {/* Testimonials Section */}
            <section className="py-20 px-4 lg:px-6 bg-light-bg border-y border-slate-100/10 animate-slide-in-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">ماذا يقول عملاؤنا؟</h2>
                    <TestimonialCarousel />
                </div>
            </section>
            
            {/* FAQ Section */}
            <section className="py-20 px-4 lg:px-6 animate-slide-in-up" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">أسئلة شائعة</h2>
                    <div className="space-y-4">
                        {faqItems.map((faq, index) => (
                            <div key={index} className="bg-light-bg/50 rounded-xl border border-slate-100/10 overflow-hidden">
                                <button onClick={() => toggleFaq(index)} aria-expanded={openFaq === index} className="w-full flex justify-between items-center text-right p-5 font-semibold text-white text-lg">
                                    <span>{faq.question}</span>
                                    {openFaq === index ? <MinusCircleIcon className="w-6 h-6 text-primary flex-shrink-0" /> : <PlusCircleIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />}
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="px-5 pb-5 text-slate-400 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;