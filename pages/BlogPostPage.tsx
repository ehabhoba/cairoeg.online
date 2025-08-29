import React, { useState, useEffect } from 'react';
import { BlogPost, getPostBySlug, addComment, getApprovedComments, Comment, getPostsByAuthor } from '../data/blogData';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { User, findUserByPhone } from '../data/userData';
import ShareButtons from '../components/ShareButtons';
import AdBanner from '../components/AdBanner';

const renderMarkdown = (markdown: string) => {
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
            return <h3 key={blockIndex} className="text-2xl font-bold text-white mt-8 mb-4">{parseInline(block.substring(4))}</h3>;
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
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const addNotification = useNotification();

    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true);
            const foundPost = await getPostBySlug(slug);
            if (foundPost && foundPost.status === 'approved') {
                setPost(foundPost);
                const postAuthor = await findUserByPhone(foundPost.authorPhone);
                setAuthor(postAuthor || null);
                const postComments = await getApprovedComments(foundPost.slug);
                setComments(postComments);

                // Fetch related posts
                if (postAuthor) {
                    const authorPosts = await getPostsByAuthor(postAuthor.phone);
                    setRelatedPosts(authorPosts.filter(p => p.slug !== foundPost.slug).slice(0, 3));
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

    const currentUrl = window.location.href;

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article>
                    <header className="text-center mb-12">
                        <a href="/blog" className="text-base text-primary font-semibold tracking-wide uppercase hover:underline">{post.category}</a>
                        <h1 className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            {post.title}
                        </h1>
                        <p className="mt-4 text-slate-400">نشر في {post.date}</p>
                    </header>
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-xl shadow-lg mb-12" />
                    <div className="prose prose-invert prose-lg mx-auto">
                        {renderMarkdown(post.content)}
                    </div>
                    <footer className="mt-12 pt-8 border-t border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {author && (
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xl">
                                        {author.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-slate-400">كتبه</p>
                                    {author ? (
                                        <a href={`/author/${author.phone}`} className="font-semibold text-white hover:text-primary">{author.name}</a>
                                    ) : (
                                        <p className="font-semibold text-white">كاتب غير معروف</p>
                                    )}
                                </div>
                            </div>
                           <ShareButtons url={currentUrl} title={post.title} />
                        </div>
                         {author && (
                            <div className="mt-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                <p className="text-sm text-slate-300">{author.bio}</p>
                            </div>
                        )}
                    </footer>
                </article>

                 {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="mt-16">
                         <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-primary pb-2">مقالات ذات صلة</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map(relatedPost => (
                                <a key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group">
                                    <img src={relatedPost.imageUrl} alt={relatedPost.title} className="w-full h-40 object-cover rounded-lg mb-2" />
                                    <h3 className="font-semibold text-white group-hover:text-primary">{relatedPost.title}</h3>
                                </a>
                            ))}
                         </div>
                    </section>
                )}


                {/* Comments Section */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b-2 border-primary pb-2">التعليقات ({comments.length})</h2>
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
    );
};

export default BlogPostPage;