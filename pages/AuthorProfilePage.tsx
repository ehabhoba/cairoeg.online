
import React, { useState, useEffect } from 'react';
import { BlogPost, getPostsByAuthor } from '../data/blogData';
import { User, findUserByPhone } from '../data/userData';
import SectionHeader from '../components/SectionHeader';

const AuthorProfilePage: React.FC<{ authorPhone: string }> = ({ authorPhone }) => {
    const [author, setAuthor] = useState<User | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const authorData = await findUserByPhone(authorPhone);
            if (authorData) {
                setAuthor(authorData);
                const authorPosts = await getPostsByAuthor(authorPhone);
                setPosts(authorPosts);
            }
            setLoading(false);
        };
        fetchData();
    }, [authorPhone]);

    if (loading) {
        return <div className="text-center py-24 text-white">جاري تحميل صفحة الكاتب...</div>;
    }

    if (!author) {
        return (
            <div className="text-center py-24">
                <h1 className="text-3xl font-bold text-white">404 - الكاتب غير موجود</h1>
                <a href="/blog" className="mt-4 inline-block text-primary hover:underline">العودة إلى المدونة</a>
            </div>
        );
    }
    
    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                     <div className="inline-block w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center text-5xl font-bold text-white mb-4 border-4 border-primary">
                        {author.name.charAt(0)}
                    </div>
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{author.name}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-slate-400">{author.bio}</p>
                </div>

                <SectionHeader title={`مقالات بقلم ${author.name}`} />

                 <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <a 
                                key={post.slug} 
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
                        ))
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                            <p className="text-slate-400 text-lg">لم يقم هذا الكاتب بنشر أي مقالات بعد.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfilePage;
