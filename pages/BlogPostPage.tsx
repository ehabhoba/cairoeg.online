
import React from 'react';
import { blogPosts } from '../data/siteData';
import { ShareIcon } from '../components/icons/ShareIcon';

// A simple markdown-to-html converter
const renderMarkdown = (markdown: string) => {
    return markdown
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map((line, index) => {
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.substring(4)}</h3>;
            }
            if (line.startsWith('*   ')) {
                return <li key={index} className="text-slate-300 leading-relaxed mb-2">{line.substring(4)}</li>;
            }
            return <p key={index} className="text-slate-300 leading-relaxed mb-4">{line}</p>;
        });
};


const BlogPostPage: React.FC<{ slug: string }> = ({ slug }) => {
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="text-center py-24">
                <h1 className="text-3xl font-bold text-white">404 - المقال غير موجود</h1>
                <a href="#/blog" className="mt-4 inline-block text-primary hover:underline">العودة إلى المدونة</a>
            </div>
        );
    }

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article>
                    <header className="text-center mb-12">
                        <p className="text-base text-primary font-semibold tracking-wide uppercase">{post.date}</p>
                        <h1 className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            {post.title}
                        </h1>
                    </header>
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg mb-12" />
                    <div className="prose prose-invert prose-lg mx-auto">
                        {renderMarkdown(post.content)}
                    </div>
                    <footer className="mt-12 pt-8 border-t border-slate-700/50 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-400">كتبه</p>
                            <p className="font-semibold text-white">{post.author}</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                            <ShareIcon className="w-4 h-4" />
                            <span>مشاركة</span>
                        </button>
                    </footer>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;
