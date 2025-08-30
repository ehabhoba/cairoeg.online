
import React, { useState, useEffect } from 'react';
import { getActiveAds, Ad } from '../data/adsData';
import SectionHeader from '../components/SectionHeader';
import { LoadingSpinner } from '../components/LoadingSpinner';

const AdsShowcasePage: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true);
            const activeAds = await getActiveAds();
            setAds(activeAds);
            setLoading(false);
        };
        fetchAds();
    }, []);

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="إعلانات المنصة"
                    subtitle="تصفح الإعلانات والخدمات المقدمة من عملاء وشركاء منصة إعلانات القاهرة."
                />

                <div className="mt-12">
                    {loading ? (
                        <div className="flex justify-center"><LoadingSpinner /></div>
                    ) : ads.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ads.map(ad => (
                                <div key={ad.id} className="group bg-slate-800/50 rounded-2xl overflow-hidden shadow-lg border border-slate-700/50 flex flex-col">
                                    <div className="overflow-hidden aspect-video">
                                        <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-white">{ad.title}</h3>
                                        <p className="text-slate-400 mt-2 text-sm flex-grow">{ad.description}</p>
                                        <a 
                                            href={ad.link_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-block text-center w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors"
                                        >
                                            اعرف المزيد
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                           <p className="text-slate-400 text-lg">لا توجد إعلانات لعرضها حاليًا.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdsShowcasePage;
