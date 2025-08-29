import React from 'react';
import SectionHeader from '../../components/SectionHeader';
import FeatureCard from '../../components/FeatureCard';
import CTABanner from '../../components/CTABanner';
import { designProcess } from '../../data/siteData';
import Tooltip from '../../components/Tooltip';
import ServicePageLayout from '../../components/ServicePageLayout';

const GraphicDesignPage: React.FC = () => {
    const features = [
        { title: 'تصميم الشعارات (اللوجو)', content: 'نصمم شعاراً فريداً واحترافياً يمثل جوهر علامتك التجارية ويبقى في أذهان عملائك.' },
        { title: 'تصميم الهوية البصرية الكاملة', content: 'نؤسس هوية متكاملة تشمل الألوان، الخطوط، والأنماط البصرية لضمان ظهور متناسق لعلامتك في كل مكان.' },
        { title: 'تصميمات السوشيال ميديا', content: 'نصمم بوستات وقصص جذابة ومبتكرة تزيد من تفاعل جمهورك على منصات التواصل الاجتماعي.' },
        { 
            title: <span>تصميم واجهات وتجربة المستخدم (<Tooltip text="UI (User Interface) is how it looks, UX (User Experience) is how it feels to use.">UI/UX</Tooltip>)</span>, 
            content: 'نصمم واجهات سهلة الاستخدام وجميلة المظهر للمواقع والتطبيقات تضمن أفضل تجربة للمستخدم.' 
        },
        { title: 'المطبوعات التجارية', content: 'تصميم بروشورات، فلايرات، كروت شخصية، وبنرات تعزز من حضورك على أرض الواقع.' },
        { title: 'موشن جرافيك وفيديوهات قصيرة', content: 'ننتج فيديوهات رسوم متحركة إبداعية لشرح خدماتك أو الترويج لمنتجاتك بطريقة جذابة.' },
    ];

    const tools = ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Adobe After Effects'];

  return (
     <ServicePageLayout
        title="التصميم الجرافيكي والهوية البصرية"
        subtitle="نترجم أفكارك إلى تصاميم إبداعية تترك انطباعاً دائماً وتعكس قصة علامتك التجارية بأسلوب فريد."
    >
        {/* What We Offer Section */}
        <div>
          <SectionHeader title="خدماتنا في التصميم" subtitle="من الفكرة إلى التنفيذ، نقدم حلولاً بصرية متكاملة." />
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
            <SectionHeader title="آلية عملنا الإبداعية" subtitle="نتبع خطوات مدروسة لضمان أن كل تصميم يعكس رؤيتك بدقة." />
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
                {designProcess.map((item, index) => (
                    <div key={item.step} className="flex flex-col items-center">
                        <div className="w-20 h-20 flex items-center justify-center bg-light-bg border-2 border-primary text-primary font-bold text-3xl rounded-full mb-4 shadow-lg shadow-primary/20">{item.step}</div>
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Tools Section */}
        <div className="mt-20">
            <SectionHeader title="البرامج التي نتقنها" />
            <div className="flex flex-wrap justify-center gap-4">
                {tools.map(tool => (
                    <div key={tool} className="bg-light-bg text-slate-300 font-semibold px-5 py-2 rounded-lg border border-slate-100/10">
                        {tool}
                    </div>
                ))}
            </div>
        </div>

        <CTABanner
            title="هل لديك فكرة تحتاج إلى تصميم؟"
            description="فريقنا من المصممين المبدعين جاهز لتحويل رؤيتك إلى حقيقة. دعنا نناقش مشروعك القادم."
            buttonText="اطلب تصميمك الآن"
            buttonLink="/contact"
        />
    </ServicePageLayout>
  );
};

export default GraphicDesignPage;