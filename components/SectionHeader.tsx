
import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-12 animate-slide-in-up" style={{ animationFillMode: 'backwards' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
    );
};

export default SectionHeader;
