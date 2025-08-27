
import React from 'react';

interface CTABannerProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

const CTABanner: React.FC<CTABannerProps> = ({ title, description, buttonText, buttonLink }) => {
    return (
        <div className="mt-20 text-center bg-slate-800/50 p-10 rounded-2xl border border-slate-700/50">
            <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                {description}
            </p>
            <a href={buttonLink} className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
                {buttonText}
            </a>
        </div>
    );
};

export default CTABanner;
