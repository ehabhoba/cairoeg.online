import React from 'react';
import SectionHeader from '../../components/SectionHeader';
import FeatureCard from '../../components/FeatureCard';
import CTABanner from '../../components/CTABanner';
import { marketingProcess, portfolioItems } from '../../data/siteData';
import { getApprovedPosts, BlogPost } from '../../data/blogData';
import Tooltip from '../../components/Tooltip';
import AIHeadlineGenerator from '../../components/AIHeadlineGenerator';
import ServicePageLayout from '../../components/ServicePageLayout';

const RelatedResourceCard: React.FC<{item: BlogPost | any, type: 'blog' | 'portfolio'}> = ({ item, type }) => (
    <a href={type === 'blog' ? `/blog/${item.slug}` : `/portfolio`} className="group block bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
        <div className="overflow-hidden h-40">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-4">
            <p className="text-xs font-semibold text-primary mb-1">{type === 'blog' ? 'من مدونتنا' : 'من أعمالنا'}</p>
            <h4 className="font-bold text-white group-hover:text-primary transition-colors text-sm leading-tight">{item.title}</h4>
        </div>
    </a>
);

const MarketingPage: React.FC = () => {
    const [relatedContent, setRelatedContent] = React.useState<{blog: BlogPost[], portfolio: any[]}>({blog: [], portfolio: []});

    React.useEffect(() => {
        const fetchRelated = async () => {
            const allPosts = await getApprovedPosts();
            const relatedBlog = allPosts.filter(p => p.category === 'الإعلانات الممولة' || p.category === 'تحسين محركات البحث').slice(0, 2);
            const relatedPortfolio = portfolioItems.filter(p => p.category === 'إعلانات ممولة' || p.category === 'SEO').slice(0, 2);
            setRelatedContent({ blog: relatedBlog, portfolio: relatedPortfolio });
        };
        fetchRelated();
    }, []);

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

        {/* Related Resources */}
        {(relatedContent.blog.length > 0 || relatedContent.portfolio.length > 0) && (
             <div className="mt-20">
                <SectionHeader title="مصادر ذات صلة" subtitle="شاهد كيف نطبق هذه الخدمات في مقالاتنا وأعمالنا السابقة." />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedContent.blog.map(item => <RelatedResourceCard key={item.slug} item={item} type="blog" />)}
                    {relatedContent.portfolio.map(item => <RelatedResourceCard key={item.id} item={item} type="portfolio" />)}
                </div>
            </div>
        )}

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
