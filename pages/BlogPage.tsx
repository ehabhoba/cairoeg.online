
import React from 'react';
import { blogPosts } from '../data/siteData';
import SectionHeader from '../components/SectionHeader';

const BlogPage: React.FC = () => {
    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="مدونة إعلانات القاهرة"
                    subtitle="مقالات ورؤى حول أحدث استراتيجيات التسويق الرقمي لمساعدتك على النمو."
                />
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <a 
                            key={post.slug} 
                            href={`#/blog/${post.slug}`} 
                            className="group block bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
                        >
                            <div className="overflow-hidden">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-primary mb-2">{post.date}</p>
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{post.title}</h3>
                                <p className="text-slate-400 mt-2 text-sm">{post.excerpt}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
