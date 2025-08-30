
import React, { useState, useEffect } from 'react';
import { BlogPost, getPostBySlug, addComment, getApprovedComments, Comment, getPostsByAuthor, getApprovedPosts } from '../data/blogData';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { User, findUserByPhone } from '../data/userData';
import ShareButtons from '../components/ShareButtons';
import ReadingProgressBar from '../components/ReadingProgressBar';
import Breadcrumbs from '../components/Breadcrumbs';
import PostNavigation from '../components/PostNavigation';

interface TocItem {
    level: number;
    text: string;
    slug: string;
}

const renderMarkdown = (markdown: string) => {
    const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FF\w-]+/g, '');

    const parseInline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={index}>{part.slice(1, -1)}</em>;
            }
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                const isExternal = linkMatch[2].startsWith('http');
                return (
                    <a key={index} href={linkMatch[2]} className="text-primary hover:underline" target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : ''}>
                        {linkMatch[1]}
                    </a>
                );
            }
            return part;
        });
    };

    const blocks = markdown.trim().split(/\n\s*\n/); 
    return blocks.map((block, blockIndex) => {
        if (block.startsWith('### ')) {
            const headingText = block.substring(4);
            const slug = slugify(headingText);
            return <h3 key={blockIndex} id={slug} className="text-2xl font-bold text-white mt-8 mb-4">{parseInline(headingText)}</h3>;
        }
        if (block.startsWith('> ')) {
            return (
                <blockquote key={blockIndex} className="border-r-4 border-primary pr-4 my-4 text-slate-400 italic">
                    {parseInline(block.substring(2))}
                </blockquote>
            );
        }
        if (block.match(/^\s*[\*\-]\s+/)) {
            const listItems = block.split('\n').map(item => item.replace(/^\s*[\*\-]\s+/, ''));
            return (
                <ul key={blockIndex} className="list-disc list-inside space-y-2 my-4 pl-4">
                    {listItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-slate-300 leading-relaxed">{parseInline(item)}</li>
                    ))}
                </ul>
            );
        }
        return <p key={blockIndex} className="text-slate-300 leading-relaxed mb-4">{parseInline(block)}</p>;
    });
};

const BlogPostPage: React.FC<{ slug: string }> = ({ slug }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [navPosts, setNavPosts] = useState<{ prev?: BlogPost, next?: BlogPost }>({});
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const addNotification = useNotification();

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true);
            const [foundPost, allPosts] = await Promise.all([
                getPostBySlug(slug),
                getApprovedPosts()
            ]);

            if (foundPost && foundPost.status === 'approved') {
                setPost(foundPost);

                // Find next/previous posts
                const currentIndex = allPosts.findIndex(p => p.slug === foundPost.slug);
                setNavPosts({
                    prev: allPosts[currentIndex + 1], // The list is newest first, so +1 is older
                    next: allPosts[currentIndex - 1],
                });

                // Generate Table of Contents
                const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FF\w-]+/g, '');
                const headingRegex = /### (.*)/g;
                const headings = Array.from(foundPost.content.matchAll(headingRegex));
                const toc = headings.map(match => ({
                    level: 3,
                    text: match[1],
                    slug: slugify(match[1])
                }));
                setTocItems(toc);

                const postAuthor = await findUserByPhone(foundPost.authorPhone);
                setAuthor(postAuthor || null);
                const postComments = await getApprovedComments(foundPost.slug);
                setComments(postComments);

                if (postAuthor) {
                    const authorPosts = await getPostsByAuthor(postAuthor.phone);
                    setRelatedPosts(authorPosts.filter(p => p.slug !== foundPost.slug).slice(0, 2));
                }
            } else {
                setPost(null);
            }
            setLoading(false);
        };
        fetchPostData();
    }, [slug]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser || !post) return;

        setIsSubmitting(true);
        try {
            await addComment(post.slug, currentUser.phone, newComment);
            setNewComment('');
            addNotification('نجاح!', 'تم إرسال تعليقك وسوف يظهر بعد المراجعة.', 'success');
        } catch (error) {
            addNotification('خطأ', 'حدث خطأ أثناء إرسال تعليقك.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return <div className="text-center py-24 text-white">جاري تحميل المقال...</div>;
    }

    if (!post) {
        return (
            <div className="text-center py-24">
                <h1 className="text-3xl font-bold text-white">404 - المقال غير موجود أو غير منشور</h1>
                <a href="/blog" className="mt-4 inline-block text-primary hover:underline">العودة إلى المدونة</a>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'الرئيسية', href: '/' },
        { label: 'المدونة', href: '/blog' },
        { label: post.title }
    ];

    const currentUrl = window.location.href;

    return (
        <>
            <ReadingProgressBar />
            <div className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Breadcrumbs items={breadcrumbItems} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                        {/* Main Content */}
                        <article className="lg:col-span-2">
                            <header className="mb-12">
                                <p className="text-base text-primary font-semibold tracking-wide uppercase">{post.category}</p>
                                <h1 className="mt-2 block text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">
                                    {post.title}
                                </h1>
                                <p className="mt-4 text-slate-400">نشر في {post.date}</p>
                            </header>
                            <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg mb-12" />
                            
                            {/* Table of Contents */}
                            {tocItems.length > 0 && (
                                <div className="mb-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                    <h2 className="text-xl font-bold text-white mb-4">جدول المحتويات</h2>
                                    <ul className="space-y-2">
                                        {tocItems.map(item => (
                                            <li key={item.slug}>
                                                <a href={`#${item.slug}`} className="text-slate-300 hover:text-primary transition-colors">
                                                    - {item.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="prose prose-invert prose-lg mx-auto">
                                {renderMarkdown(post.content)}
                            </div>
                            
                            <PostNavigation previousPost={navPosts.prev} nextPost={navPosts.next} />

                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-8 sticky top-24">
                            {/* Author Card */}
                            {author && (
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-2xl flex-shrink-0">
                                            {author.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">كتبه</p>
                                            <a href={`/author/${author.phone}`} className="font-semibold text-white text-lg hover:text-primary">{author.name}</a>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-300">{author.bio}</p>
                                </div>
                            )}

                            {/* Share Buttons */}
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                <h3 className="text-lg font-bold text-white mb-4">مشاركة المقال</h3>
                                <ShareButtons url={currentUrl} title={post.title} />
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                    <h3 className="text-lg font-bold text-white mb-4">مقالات ذات صلة</h3>
                                    <div className="space-y-4">
                                        {relatedPosts.map(relatedPost => (
                                            <a key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group flex items-center gap-4">
                                                <img src={relatedPost.imageUrl} alt={relatedPost.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-white group-hover:text-primary leading-tight">{relatedPost.title}</h4>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>

                    {/* Comments Section */}
                    <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-700/50">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">التعليقات ({comments.length})</h2>
                            <div className="space-y-6">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 flex-shrink-0">
                                            {comment.authorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{comment.authorName}</p>
                                            <p className="text-slate-300">{comment.content}</p>
                                            <p className="text-xs text-slate-500 mt-1">{new Date(comment.date).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Comment Form */}
                            <div className="mt-10">
                                <h3 className="text-xl font-bold text-white mb-4">أضف تعليقك</h3>
                                {currentUser ? (
                                    <form onSubmit={handleCommentSubmit}>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={4}
                                            placeholder="اكتب تعليقك هنا..."
                                            className="w-full p-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="mt-4 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-slate-400">
                                        <a href="/login" className="text-primary hover:underline">سجل الدخول</a> لتتمكن من إضافة تعليق.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </>
    );
};

export default BlogPostPage;
