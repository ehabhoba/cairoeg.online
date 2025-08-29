import React from 'react';
import SectionHeader from '../../components/SectionHeader';
import FeatureCard from '../../components/FeatureCard';
import CTABanner from '../../components/CTABanner';
import { adCreationProcess } from '../../data/siteData';
import ServicePageLayout from '../../components/ServicePageLayout';

const AdCreationPage: React.FC = () => {
    const features = [
        { title: 'تصميم إعلانات جذابة', content: 'نصمم صور وفيديوهات إعلانية احترافية تلفت انتباه جمهورك وتوصل رسالتك بوضوح.' },
        { title: 'كتابة نصوص إعلانية مقنعة', content: 'نكتب نصوصاً إعلانية (Copywriting) تشجع المستخدم على اتخاذ الإجراء الذي تريده، سواء كان شراء أو تسجيل.' },
        { title: 'استهداف دقيق للجمهور', content: 'نستخدم أدوات متقدمة لتحديد واستهداف الجمهور المناسب لإعلانك بناءً على اهتماماتهم وسلوكياتهم.' },
        { title: 'اختبار A/B للإعلانات', content: 'نقوم باختبار نسخ متعددة من إعلاناتك لتحديد النسخة الأفضل أداءً وتحقيق أعلى عائد.' },
        { title: 'إدارة الميزانية الإعلانية', content: 'ندير ميزانيتك بكفاءة لضمان الحصول على أفضل النتائج بأقل تكلفة ممكنة.' },
        { title: 'إطلاق على مختلف المنصات', content: 'نطلق حملاتك على المنصات الأكثر فعالية لعملك، بما في ذلك فيسبوك، انستغرام، جوجل، وتيك توك.' },
    ];

    const platforms = ['Meta (Facebook & Instagram)', 'Google Ads (Search & Display)', 'TikTok Ads', 'LinkedIn Ads'];

  return (
    <ServicePageLayout
        title="إنشاء ونشر الحملات الإعلانية"
        subtitle="من الفكرة إلى الإطلاق، نتولى جميع خطوات حملتك الإعلانية لضمان وصولها إلى جمهورك وتحقيق أهدافك."
    >
        {/* What We Offer Section */}
        <div>
          <SectionHeader title="ماذا تشمل خدمة إنشاء الإعلانات؟" subtitle="نقدم خدمة متكاملة تغطي جميع جوانب الحملة الإعلانية." />
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
            <SectionHeader title="خطواتنا لإطلاق حملة ناجحة" subtitle="نتبع عملية منظمة تضمن إطلاق حملتك بكفاءة وفعالية." />
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
                {adCreationProcess.map((item) => (
                    <div key={item.step} className="flex flex-col items-center">
                        <div className="w-20 h-20 flex items-center justify-center bg-light-bg border-2 border-primary text-primary font-bold text-3xl rounded-full mb-4 shadow-lg shadow-primary/20">{item.step}</div>
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Platforms Section */}
        <div className="mt-20">
            <SectionHeader title="المنصات التي نعمل عليها" />
            <div className="flex flex-wrap justify-center gap-4">
                {platforms.map(platform => (
                    <div key={platform} className="bg-light-bg text-slate-300 font-semibold px-5 py-2 rounded-lg border border-slate-100/10">
                        {platform}
                    </div>
                ))}
            </div>
        </div>

        <CTABanner
            title="هل أنت جاهز لإطلاق حملتك القادمة؟"
            description="دع خبرائنا يتولون المهمة. تواصل معنا الآن لمناقشة أهدافك الإعلانية."
            buttonText="اطلب حملتك الإعلانية"
            buttonLink="/contact"
        />
    </ServicePageLayout>
  );
};

export default AdCreationPage;