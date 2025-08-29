import React from 'react';
import SectionHeader from '../../components/SectionHeader';
import FeatureCard from '../../components/FeatureCard';
import CTABanner from '../../components/CTABanner';
import { marketingProcess } from '../../data/siteData';
import Tooltip from '../../components/Tooltip';
import AIHeadlineGenerator from '../../components/AIHeadlineGenerator';
import ServicePageLayout from '../../components/ServicePageLayout';

const MarketingPage: React.FC = () => {
    const features = [
        { 
            title: <span>إدارة حملات الإعلانات الممولة (<Tooltip text="Pay-Per-Click: إعلانات تدفع فيها مقابل كل نقرة">PPC</Tooltip>)</span>, 
            content: 'نخطط ونطلق وندير حملات إعلانية مدفوعة على منصات جوجل، فيسبوك، انستغرام، تيك توك، ولينكدإن لزيادة الوعي والمبيعات.' 
        },
        { 
            title: <span>تحسين محركات البحث (<Tooltip text="Search Engine Optimization: عملية تحسين موقعك للظهور في نتائج البحث الأولى">SEO</Tooltip>)</span>, 
            content: 'نحسن من ظهور موقعك في الصفحات الأولى لنتائج البحث لزيادة الزيارات المجانية والمستهدفة من عملائك المحتملين.' 
        },
        { title: 'التسويق عبر وسائل التواصل الاجتماعي', content: 'نضع استراتيجية محتوى فعالة وندير حساباتك لزيادة التفاعل وبناء مجتمع قوي حول علامتك التجارية.' },
        { title: 'التسويق بالمحتوى', content: 'ننشئ محتوى جذاب ومفيد (مقالات، فيديوهات، انفوجرافيك) يجذب جمهورك المستهدف ويحولهم إلى عملاء.' },
        { title: 'التسويق عبر البريد الإلكتروني', content: 'نصمم ونرسل حملات بريدية مستهدفة للحفاظ على ولاء عملائك الحاليين وتشجيعهم على الشراء مجدداً.' },
        { title: 'تحليل البيانات والتقارير', content: 'نقدم تقارير دورية ومفصلة عن أداء حملاتك مع توصيات واضحة لتحسين النتائج بشكل مستمر.' },
    ];

    const tools = ['Google Ads', 'Meta Business Suite', 'Google Analytics', 'SEMrush', 'Ahrefs', 'Mailchimp'];

  return (
    <ServicePageLayout
        title="التسويق الرقمي والإعلانات الممولة"
        subtitle="نصل بعلامتك التجارية إلى الجمهور المناسب في الوقت المناسب، ونحقق أعلى عائد على استثمارك الإعلاني."
    >
        {/* What We Offer Section */}
        <div>
          <SectionHeader title="خدماتنا في التسويق الرقمي" subtitle="حلول متكاملة لنمو أعمالك على الإنترنت" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
                <FeatureCard key={i} title={feature.title}>
                    {feature.content}
                </FeatureCard>
            ))}
          </div>
        </div>

        {/* AI Tool Section */}
        <div className="mt-20">
            <SectionHeader title="جرب بنفسك: مولد العناوين الإعلانية" subtitle="أدخل وصف منتجك واحصل على أفكار إعلانية فورية باستخدام الذكاء الاصطناعي." />
            <AIHeadlineGenerator />
        </div>
        
        {/* Our Process Section */}
        <div className="mt-20">
            <SectionHeader title="آلية عملنا في التسويق" subtitle="نتبع منهجية واضحة تضمن تحقيق أفضل النتائج لحملاتك." />
            <div className="relative max-w-3xl mx-auto">
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-slate-700 hidden md:block" style={{ top: '20px', bottom: '20px' }}></div>
                {marketingProcess.map((item, index) => (
                    <div key={item.step} className="md:flex items-center md:gap-8 mb-12 relative">
                        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left md:ml-auto'}`}>
                            <h3 className="text-2xl font-bold text-primary mb-2">الخطوة {item.step}: {item.title}</h3>
                            <p className="text-slate-400">{item.description}</p>
                        </div>
                        <div className="hidden md:flex w-10 h-10 absolute left-1/2 -translate-x-1/2 bg-primary rounded-full items-center justify-center text-white font-bold border-4 border-dark-bg shadow-lg shadow-primary/30">
                           {item.step}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Tools Section */}
        <div className="mt-16">
            <SectionHeader title="الأدوات والتقنيات التي نستخدمها" />
            <div className="flex flex-wrap justify-center gap-4">
                {tools.map(tool => (
                    <div key={tool} className="bg-light-bg text-slate-300 font-semibold px-5 py-2 rounded-lg border border-slate-100/10">
                        {tool}
                    </div>
                ))}
            </div>
        </div>

        <CTABanner
            title="هل أنت مستعد للنمو؟"
            description="دعنا نساعدك في بناء استراتيجية تسويق رقمي ناجحة. تواصل معنا اليوم للحصول على استشارة مجانية."
            buttonText="تواصل معنا الآن"
            buttonLink="/contact"
        />
    </ServicePageLayout>
  );
};

export default MarketingPage;