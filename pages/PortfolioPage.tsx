
import React, { useState, useEffect } from 'react';
import { portfolioItems } from '../data/siteData';
import SkeletonCard from '../components/SkeletonCard';

const categories = ['الكل', 'إعلانات ممولة', 'تصميم جرافيكي', 'تصميم مواقع', 'SEO'];

const PortfolioPage: React.FC = () => {
    const [filter, setFilter] = useState('الكل');
    const [loading, setLoading] = useState(false);
    const [filteredItems, setFilteredItems] = useState(portfolioItems);

    useEffect(() => {
        setLoading(true);
        // Simulate network delay for a better UX showcase
        const timer = setTimeout(() => {
            if (filter === 'الكل') {
                setFilteredItems(portfolioItems);
            } else {
                setFilteredItems(portfolioItems.filter(item => item.category === filter));
            }
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [filter]);

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                        معرض أعمالنا
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
                        نظرة على بعض المشاريع التي نفخر بها والتي ساهمت في نجاح عملائنا.
                    </p>
                </div>

                {/* Filters */}
                <div className="mt-12 flex justify-center flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === category ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Portfolio Grid */}
                <div key={filter} className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                         Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="group relative block bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 animate-fade-in">
                                <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                    <p className="text-sm text-primary">{item.category}</p>
                                    <p className="text-xs text-slate-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;
