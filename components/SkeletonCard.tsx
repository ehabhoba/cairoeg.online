
import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700/50">
            <div className="w-full h-60 bg-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/50 to-transparent animate-shimmer" style={{ backgroundSize: '2000px 100%' }}></div>
            </div>
            <div className="p-4">
                <div className="h-6 w-3/4 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
