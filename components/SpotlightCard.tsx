import React, { useRef } from 'react';

interface SpotlightCardProps {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ title, description, link, icon }) => {
    const cardRef = useRef<HTMLAnchorElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            cardRef.current?.style.setProperty('--mouse-x', `${x}px`);
            cardRef.current?.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    return (
        <a 
            href={link}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="spotlight-card block relative bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:border-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 overflow-hidden h-full"
        >
            <div className="relative z-10">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary rounded-xl mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
            </div>
        </a>
    );
};

export default SpotlightCard;
