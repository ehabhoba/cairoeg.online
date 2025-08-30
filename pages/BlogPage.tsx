
import React, { useState, useEffect } from 'react';
import { BlogPost, getApprovedPosts, blogCategories } from '../data/blogData';
import SectionHeader from '../components/SectionHeader';
import AdBanner from '../components/AdBanner';
import { DocumentSearchIcon } from '../components/icons/DocumentSearchIcon';

const BlogSkeleton: React.FC = () => (
    <>
        {/* Featured Post Skeleton */}
        <div className="col-span-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 animate-pulse">
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="h-80 bg-slate-700 rounded-xl"></div>
                <div>
                    <div className="h-4 w-1/4 bg-slate-700 rounded mb-4"></div>
                    <div className="h-8 w-full bg-slate-700 rounded mb-4"></div>
                    <div className="h-8 w-3/4 bg-slate-700 rounded mb-6"></div>
                    <div className="h-5 w-full bg-slate-700 rounded mb-2"></div>
                    <div className="h-5 w-5/6 bg-slate-700 rounded"></div>
                </div>
            </div>
        </div>
        {/* Regular Post Skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 animate-pulse">
                <div className="h-48 bg-slate-700"></div>
                <div className="p-6">
                    <div className="h-4 w-1/3 bg-slate-700 rounded mb-3"></div>
                    <div className="h-6 w-full bg-slate-700 rounded mb-3"></div>
                    <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
                </div>
            </div>
        ))}
    </>
);

const BlogEmptyState: React.FC = () => (
     <div className="col-span-full text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700/50">
        <DocumentSearchIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-white">لم يتم العثور على مقالات</h3>
        <p className="text-slate-400 mt-2">لا توجد مقالات تطابق بحثك حاليًا. جرب كلمة بحث أخرى أو فلتر مختلف.</p>
    </div>
)

const BlogPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const allPosts = await getApprovedPosts();
            
            let filtered = allPosts;

            if (activeCategory !== 'الكل') {
                filtered = filtered.filter(post => post.category === activeCategory);
            }

            if (searchTerm.trim() !== '') {
                filtered = filtered.filter(post =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            setPosts(filtered);
            // Simulate loading for better UX
            setTimeout(() => setLoading(false), 500);
        };
        fetchPosts();
    }, [searchTerm, activeCategory]);
    
    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="مدونة إعلانات القاهرة"
                    subtitle="مقالات ورؤى حول أحدث استراتيجيات التسويق الرقمي لمساعدتك على النمو."
                />

                 {/* Search and Filter Section */}
                <div className="mb-12">
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث في المقالات..."
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary"
                            aria-label="Search blog posts"
                        />
                    </div>
                    <div className="mt-6 flex justify-center flex-wrap gap-2">
                        {blogCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === category ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="text-center mb-12">
                    <a href="/publish-article" className="inline-block px-6 py-3 bg-gold text-dark-bg font-bold rounded-xl shadow-lg hover:bg-gold/90 transition-all transform hover:scale-105">
                       + انشر مقالتك وشارك خبراتك
                    </a>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {loading ? (
                       <BlogSkeleton />
                    ) : posts.length > 0 ? (
                        <>
                            {/* Featured Post */}
                            <a href={`/blog/${featuredPost.slug}`} className="lg:col-span-3 group block bg-slate-800/50 rounded-2xl border border-slate-700/50 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50">
                                <div className="grid md:grid-cols-2 gap-6 items-center p-6">
                                    <div className="overflow-hidden rounded-xl">
                                        <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-primary font-semibold mb-2">{featuredPost.category} &middot; {featuredPost.date}</p>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-primary-light transition-colors">{featuredPost.title}</h2>
                                        <p className="text-slate-400 leading-relaxed">{featuredPost.excerpt}</p>
                                    </div>
                                </div>
                            </a>

                            {/* Remaining Posts */}
                            {remainingPosts.map((post, index) => (
                                <React.Fragment key={post.slug}>
                                    <a 
                                        href={`/blog/${post.slug}`} 
                                        className="group block bg-slate-800/50 rounded-xl overflow-hidden shadow-lg border border-slate-700/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
                                    >
                                        <div className="overflow-hidden">
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="p-6">
                                            <p className="text-sm text-primary mb-2">{post.date} &middot; {post.category}</p>
                                            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{post.title}</h3>
                                            <p className="text-slate-400 mt-2 text-sm">{post.excerpt}</p>
                                        </div>
                                    </a>
                                    { (index + 1) % 5 === 0 && (
                                        <div className="md:col-span-2 lg:col-span-3 my-4">
                                            <AdBanner />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                        <BlogEmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
