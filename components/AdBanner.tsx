
import React, { useState, useEffect } from 'react';
import { mockAds } from '../data/mockAds';

const AdBanner: React.FC = () => {
    const [ad, setAd] = useState(mockAds[0]);

    useEffect(() => {
        // Select a random ad
        const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];
        setAd(randomAd);
    }, []);

    return (
        <div className="bg-slate-900 border-y border-slate-800 my-8">
            <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <img src={ad.imageUrl} alt={ad.title} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg" />
                    <div>
                        <p className="text-xs text-gold font-semibold">إعلان مميز</p>
                        <h3 className="text-lg md:text-xl font-bold text-white">{ad.title}</h3>
                        <p className="text-sm text-slate-400 hidden md:block">{ad.description}</p>
                    </div>
                </div>
                <a 
                    href={ad.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                    اعرف المزيد
                </a>
            </div>
        </div>
    );
};

export default AdBanner;
