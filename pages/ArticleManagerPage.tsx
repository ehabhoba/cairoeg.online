import React, { useState, useEffect, useCallback } from 'react';
import { BlogPost, getAllPosts, updatePostStatus } from '../data/blogData';
import { useNotification } from '../hooks/useNotification';
import Badge from '../components/Badge';

const ArticleManagerPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotification();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const allPosts = await getAllPosts();
            setPosts(allPosts);
        } catch (error) {
            addNotification('خطأ', 'فشل في تحميل المقالات', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleStatusChange = async (slug: string, status: 'approved' | 'rejected') => {
        try {
            await updatePostStatus(slug, status);
            addNotification('نجاح!', `تم تحديث حالة المقال بنجاح.`, 'success');
            fetchPosts(); // Refresh the list
        } catch (error) {
            addNotification('خطأ', 'فشل في تحديث حالة المقال.', 'error');
        }
    };

    const getBadgeColor = (status: BlogPost['status']) => {
        switch (status) {
            case 'approved': return 'green';
            case 'pending': return 'yellow';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };
     const getStatusText = (status: BlogPost['status']) => {
        switch (status) {
            case 'approved': return 'موافق عليه';
            case 'pending': return 'قيد المراجعة';
            case 'rejected': return 'مرفوض';
            default: return 'غير معروف';
        }
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">إدارة المقالات</h1>
                
                <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-light-bg/50 text-slate-400">
                                <tr>
                                    <th scope="col" className="p-4 font-semibold">عنوان المقال</th>
                                    <th scope="col" className="p-4 font-semibold">الكاتب (رقم الهاتف)</th>
                                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                                    <th scope="col" className="p-4 font-semibold">تاريخ التقديم</th>
                                    <th scope="col" className="p-4 font-semibold">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/10">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-4 text-center text-slate-400">جاري تحميل المقالات...</td></tr>
                                ) : posts.map((post) => (
                                    <tr key={post.slug} className="hover:bg-light-bg/30">
                                        <td className="p-4 font-medium text-white max-w-xs truncate">{post.title}</td>
                                        <td className="p-4 text-slate-400">{post.authorPhone}</td>
                                        <td className="p-4">
                                            <Badge color={getBadgeColor(post.status)}>{getStatusText(post.status)}</Badge>
                                        </td>
                                        <td className="p-4 text-slate-400">{post.date}</td>
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            {post.status !== 'approved' && (
                                                <button onClick={() => handleStatusChange(post.slug, 'approved')} className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full hover:bg-green-500/40">موافقة</button>
                                            )}
                                            {post.status !== 'rejected' && (
                                                <button onClick={() => handleStatusChange(post.slug, 'rejected')} className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full hover:bg-red-500/40">رفض</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ArticleManagerPage;