
import React from 'react';

interface FeatureCardProps {
    title: React.ReactNode;
    children: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 h-full">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{children}</p>
    </div>
);

export default FeatureCard;
