

import React, { useState, useEffect, useRef } from 'react';
import { testimonials, portfolioItems, faqItems, services } from '../data/siteData';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { PaintBrushIcon } from '../components/icons/PaintBrushIcon';
import { MegaphoneIcon } from '../components/icons/MegaphoneIcon';
import { CodeBracketIcon } from '../components/icons/CodeBracketIcon';
import { GlobeIcon } from '../components/icons/GlobeIcon';
import { RocketLaunchIcon } from '../components/icons/RocketLaunchIcon';

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

const SpotlightCard: React.FC<{ service: typeof services[0], link: string }> = ({ service, link }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cardRef.current?.style.setProperty('--mouse-x', `${x}px`);
            cardRef.current?.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    return (
        <a 
            href={link}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="spotlight-card block relative bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 overflow-hidden"
        >
            <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-xl mb-4">
                    {iconMap[service.id]}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{service.description}</p>
            </div>
        </a>
    );
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
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 text-center h-full flex flex-col justify-center">
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
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    lineRef.current?.classList.add('animate-draw-line');
                }
            },
            { threshold: 0.5 }
        );
        if (lineRef.current) observer.observe(lineRef.current);
        return () => observer.disconnect();
    }, []);

    const serviceLinks: { [id: string]: string } = {
        'ads': '#/services/marketing',
        'creation': '#/services/ad-creation',
        'design': '#/services/graphic-design',
        'dev': '#/services/web-design',
        'seo': '#/services/marketing',
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative text-center py-24 px-4 sm:py-32 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-dark-bg bg-[size:400%_400%] animate-background-pan"></div>
                 <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/10 to-dark-bg"></div>
                 <div className="relative z-10 max-w-4xl mx-auto">
                    <img src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" className="w-48 md:w-56 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        إعلانات القاهرة – علامتك التجارية تبدأ من هنا
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        شريكك الرقمي الأول لتحقيق النجاح. نقدم حلول تسويق إلكتروني وإعلانات مبتكرة تدعم نمو أعمالك في مصر والوطن العربي.
                    </p>
                    <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <a href="#/contact" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105">
                            اطلب استشارة مجانية
                        </a>
                        <a href="#/portfolio" className="px-6 py-3 bg-slate-700 text-white font-bold rounded-xl shadow-lg hover:bg-slate-600 transition-all transform hover:scale-105">
                            شاهد أعمالنا
                        </a>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 px-4 lg:px-6 animate-slide-in-up" style={{ animationFillMode: 'backwards' }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">خدمات احترافية لدعم علامتك التجارية</h2>
                    <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">من الاستراتيجية إلى التنفيذ، نقدم كل ما تحتاجه للتميز في العالم الرقمي.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => (
                            <SpotlightCard key={service.id} service={service} link={serviceLinks[service.id]} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Our Numbers Section */}
            <section className="py-20 px-4 lg:px-6 bg-slate-900 border-y border-slate-800 animate-slide-in-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
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

            {/* How We Work Section */}
            <section className="py-20 px-4 lg:px-6 animate-slide-in-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">آلية عملنا.. بسيطة وفعّالة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-8 -translate-y-1/2 left-0 w-full h-0.5 bg-slate-700">
                             <div ref={lineRef} className="h-full bg-primary"></div>
                        </div>
                        <div className="relative z-10 flex flex-col items-center animate-slide-in-right" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
                            <div className="w-16 h-16 flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full border-4 border-slate-900 mb-4">1</div>
                            <h3 className="text-xl font-bold text-white mb-2">الاستكشاف والتحليل</h3>
                            <p className="text-slate-400">نستمع لأهدافك ونحلل وضعك الحالي لنبني استراتيجية مخصصة.</p>
                        </div>
                        <div className="relative z-10 flex flex-col items-center animate-slide-in-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
                             <div className="w-16 h-16 flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full border-4 border-slate-900 mb-4">2</div>
                            <h3 className="text-xl font-bold text-white mb-2">التنفيذ والإطلاق</h3>
                            <p className="text-slate-400">نطلق حملاتك ونصمم هويتك بأيدي فريق من الخبراء والمبدعين.</p>
                        </div>
                        <div className="relative z-10 flex flex-col items-center animate-slide-in-left" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
                             <div className="w-16 h-16 flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full border-4 border-slate-900 mb-4">3</div>
                            <h3 className="text-xl font-bold text-white mb-2">التحسين والتقارير</h3>
                            <p className="text-slate-400">نراقب الأداء، نحسن النتائج، ونقدم لك تقارير دورية وشفافة.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Testimonials Section */}
            <section className="py-20 px-4 lg:px-6 bg-slate-900 border-y border-slate-800 animate-slide-in-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
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
                            <div key={index} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                                <button onClick={() => toggleFaq(index)} aria-expanded={openFaq === index} className="w-full flex justify-between items-center text-right p-5 font-semibold text-white">
                                    <span>{faq.question}</span>
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-5 pb-5 text-slate-400 leading-relaxed animate-fade-in">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">جاهز لتبدأ قصة نجاحك الرقمية؟</h2>
                    <p className="text-slate-400 mb-8">
                        فريقنا جاهز لمساعدتك في تحقيق أهدافك. تواصل معنا اليوم ودعنا نبدأ في بناء استراتيجية تليق بعلامتك التجارية.
                    </p>
                    <a href="#/contact" className="inline-block px-8 py-3 bg-gold text-dark-bg font-bold rounded-xl shadow-lg hover:bg-gold/90 transition-all transform hover:scale-105">
                        تواصل معنا الآن
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HomePage;