import React from 'react';
import SectionHeader from '../../components/SectionHeader';
import FeatureCard from '../../components/FeatureCard';
import CTABanner from '../../components/CTABanner';
import { webdevProcess } from '../../data/siteData';
import Tooltip from '../../components/Tooltip';
import ServicePageLayout from '../../components/ServicePageLayout';

const WebDesignPage: React.FC = () => {
    const features = [
        { title: 'تصميم المتاجر الإلكترونية المتكاملة', content: 'نطور متاجر إلكترونية احترافية مع لوحة تحكم سهلة، وربط مع بوابات الدفع وشركات الشحن.' },
        { title: 'تصميم المواقع التعريفية للشركات', content: 'نصمم مواقع جذابة تعكس هوية شركتك، تعرض خدماتك بشكل احترافي، وتسهل على العملاء التواصل معك.' },
        { title: 'تصميم متجاوب مع جميع الأجهزة', content: 'نضمن أن موقعك يعمل ويبدو بشكل مثالي على جميع الشاشات، من الهواتف المحمولة إلى الحواسيب المكتبية.' },
        { title: 'تحسين سرعة وأداء المواقع', content: 'نهتم بأدق التفاصيل التقنية لضمان تحميل موقعك بسرعة فائقة، مما يحسن تجربة المستخدم وترتيبك في جوجل.' },
        { title: 'الدعم الفني والصيانة', content: 'نقدم خدمات الدعم الفني المستمر لضمان عمل موقعك بكفاءة وأمان على مدار الساعة.' },
        { 
            title: <span>أنظمة إدارة المحتوى (<Tooltip text="Content Management System: نظام يتيح لك التحكم في محتوى موقعك بسهولة.">CMS</Tooltip>)</span>, 
            content: 'نبني مواقع باستخدام أنظمة سهلة مثل ووردبريس، مما يتيح لك التحكم الكامل في محتوى موقعك وتحديثه بسهولة.' 
        },
    ];

    const tools = ['React', 'Next.js', 'Tailwind CSS', 'WordPress', 'Shopify', 'Node.js', 'Supabase'];

  return (
    <ServicePageLayout
        title="تصميم المواقع والمتاجر الإلكترونية"
        subtitle="نبني لك واجهة رقمية قوية، سريعة، وآمنة، تضمن أفضل تجربة لعملائك وتزيد من مبيعاتك على الإنترنت."
    >
        {/* What We Offer Section */}
        <div>
          <SectionHeader title="حلولنا في تطوير الويب" subtitle="من المواقع البسيطة إلى المتاجر المعقدة، نقدم حلولاً تقنية متكاملة."/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {features.map((feature, i) => (
                <FeatureCard key={i} title={feature.title}>
                    {feature.content}
                </FeatureCard>
            ))}
          </div>
        </div>
        
        {/* Our Process Section */}
        <div className="mt-20">
            <SectionHeader title="دورة حياة تطوير المشروع" subtitle="نتبع منهجية منظمة لضمان تسليم مشروعك بأعلى جودة وفي الوقت المحدد." />
            <div className="relative max-w-5xl mx-auto">
                 <div className="absolute top-8 left-0 hidden md:block w-full h-0.5 bg-slate-700"></div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                    {webdevProcess.map((item, index) => (
                        <div key={item.step} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-primary text-white font-bold text-2xl rounded-full border-4 border-dark-bg z-10 shadow-lg shadow-primary/30">{item.step}</div>
                            <div className="mt-4">
                                <h3 className="font-bold text-white">{item.title}</h3>
                                <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Tools Section */}
        <div className="mt-20">
            <SectionHeader title="التقنيات التي نستخدمها" />
             <div className="flex flex-wrap justify-center gap-4">
                {tools.map(tool => (
                    <div key={tool} className="bg-light-bg text-slate-300 font-semibold px-5 py-2 rounded-lg border border-slate-100/10">
                        {tool}
                    </div>
                ))}
            </div>
        </div>

        <CTABanner
            title="هل أنت جاهز لإطلاق موقعك؟"
            description="سواء كنت تبدأ من الصفر أو ترغب في تطوير موقعك الحالي، نحن هنا لمساعدتك."
            buttonText="احصل على عرض سعر"
            buttonLink="/contact"
        />
    </ServicePageLayout>
  );
};

export default WebDesignPage;