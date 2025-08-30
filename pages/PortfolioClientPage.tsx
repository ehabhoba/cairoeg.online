import React, { useState, useEffect } from 'react';
import { getClientShowcaseData, ClientShowcase } from '../data/portfolioData';
import { LoadingSpinner } from '../components/LoadingSpinner';
import SectionHeader from '../components/SectionHeader';
import { GlobeAltIcon } from '../components/icons/GlobeAltIcon';

const PortfolioClientPage: React.FC<{ clientPhone: string }> = ({ clientPhone }) => {
    const [showcase, setShowcase] = useState<ClientShowcase | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getClientShowcaseData(clientPhone);
            setShowcase(data);
            setLoading(false);
        };
        fetchData();
    }, [clientPhone]);

    if (loading) {
        return <div className="min-h-screen bg-dark-bg flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (!showcase) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center text-center text-white">
                <div>
                    <h1 className="text-3xl font-bold">لم يتم العثور على العميل</h1>
                    <a href="/portfolio" className="mt-4 inline-block text-primary hover:underline">العودة إلى معرض الأعمال</a>
                </div>
            </div>
        );
    }
    
    const { client, designs, articles, socials } = showcase;

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Client Header */}
                <div className="text-center mb-16">
                    <img 
                        src={client.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=1D4ED8&color=fff&size=128`} 
                        alt={`${client.name} logo`} 
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover bg-light-bg border-4 border-primary"
                    />
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{client.name}</h1>
                    {socials.page_link && (
                        <a href={socials.page_link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
                            <GlobeAltIcon className="w-5 h-5" />
                            <span>زيارة الموقع</span>
                        </a>
                    )}
                </div>

                {/* Designs Section */}
                {designs.length > 0 && (
                    <div className="mb-16">
                        <SectionHeader title="تصميمات ومنشورات" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {designs.map(design => (
                                <a key={design.id} href={design.url} target="_blank" rel="noopener noreferrer" className="group aspect-square block bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
                                    <img src={design.url} alt={design.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Articles Section */}
                {articles.length > 0 && (
                    <div>
                        <SectionHeader title="مقالات تم نشرها" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {articles.map(article => (
                                <a 
                                    key={article.slug} 
                                    href={`/blog/${article.slug}`} 
                                    className="group block bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
                                >
                                    <div className="overflow-hidden h-48">
                                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{article.title}</h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PortfolioClientPage;
