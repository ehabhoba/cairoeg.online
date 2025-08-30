
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { addPost, blogCategories } from '../data/blogData';
import SectionHeader from '../components/SectionHeader';

const PublishArticlePage: React.FC = () => {
    const { currentUser } = useAuth();
    const addNotification = useNotification();
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState(blogCategories[1]);
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            addNotification('خطأ', 'يجب عليك تسجيل الدخول أولاً لنشر مقال.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await addPost({
                title,
                excerpt,
                content,
                imageUrl,
                category,
                tags: tags.split(',').map(t => t.trim()),
                authorPhone: currentUser.phone
            });
            addNotification('نجاح!', 'تم إرسال مقالك بنجاح للمراجعة.', 'success');
            setTitle('');
            setExcerpt('');
            setContent('');
            setImageUrl('');
            setTags('');
        } catch (error) {
            addNotification('خطأ', 'حدث خطأ أثناء إرسال مقالك.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return (
             <div className="text-center py-24">
                <h1 className="text-3xl font-bold text-white">يجب عليك تسجيل الدخول أولاً</h1>
                <p className="text-slate-400 mt-2">لتتمكن من نشر مقال، يرجى تسجيل الدخول إلى حسابك.</p>
                <a href="/login" className="mt-6 inline-block px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">
                    تسجيل الدخول
                </a>
            </div>
        )
    }

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="انشر مقالتك"
                    subtitle="شارك معرفتك وخبراتك مع مجتمعنا. سيتم مراجعة مقالك من قبل الإدارة قبل النشر."
                />

                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-300">عنوان المقال</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-300">مقتطف قصير (للمعاينة)</label>
                            <input type="text" id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300">رابط صورة المقال</label>
                            <input type="url" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-300">محتوى المقال (يدعم الماركدون)</label>
                            <textarea id="content" rows={10} value={content} onChange={e => setContent(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary"></textarea>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-300">القسم</label>
                                <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary">
                                    {blogCategories.filter(c => c !== 'الكل').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-300">الكلمات المفتاحية (افصل بينها بفاصلة)</label>
                                <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary disabled:opacity-50"
                            >
                                {isLoading ? 'جاري الإرسال...' : 'إرسال للمراجعة'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PublishArticlePage;
