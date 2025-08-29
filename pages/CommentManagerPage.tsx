import React, { useState, useEffect, useCallback } from 'react';
import { Comment, getAllComments, updateCommentStatus, deleteComment } from '../data/blogData';
import { useNotification } from '../hooks/useNotification';
import Badge from '../components/Badge';

const CommentManagerPage: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotification();

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const allComments = await getAllComments();
            setComments(allComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            addNotification('خطأ', 'فشل في تحميل التعليقات', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleApprove = async (id: number) => {
        try {
            await updateCommentStatus(id, 'approved');
            addNotification('نجاح!', 'تمت الموافقة على التعليق.', 'success');
            fetchComments();
        } catch (error) {
            addNotification('خطأ', 'فشل في الموافقة على التعليق.', 'error');
        }
    };
    
    const handleDelete = async (id: number) => {
        try {
            await deleteComment(id);
            addNotification('نجاح!', 'تم حذف التعليق بنجاح.', 'success');
            fetchComments();
        } catch (error) {
            addNotification('خطأ', 'فشل في حذف التعليق.', 'error');
        }
    };

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">إدارة التعليقات</h1>

                <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                             <thead className="bg-light-bg/50 text-slate-400">
                                <tr>
                                    <th scope="col" className="p-4 font-semibold">التعليق</th>
                                    <th scope="col" className="p-4 font-semibold">الكاتب</th>
                                    <th scope="col" className="p-4 font-semibold">المقال</th>
                                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                                    <th scope="col" className="p-4 font-semibold">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/10">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-4 text-center text-slate-400">جاري تحميل التعليقات...</td></tr>
                                ) : comments.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-light-bg/30">
                                        <td className="p-4 text-slate-300 max-w-sm break-words">{comment.content}</td>
                                        <td className="p-4 text-slate-400">{comment.authorName}</td>
                                        <td className="p-4 text-slate-400 max-w-[150px] truncate">{comment.postSlug}</td>
                                        <td className="p-4">
                                            <Badge color={comment.status === 'approved' ? 'green' : 'yellow'}>
                                                {comment.status === 'approved' ? 'موافق عليه' : 'قيد المراجعة'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 space-x-2 whitespace-nowrap">
                                            {comment.status === 'pending' && (
                                                <button onClick={() => handleApprove(comment.id)} className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full hover:bg-green-500/40">موافقة</button>
                                            )}
                                            <button onClick={() => handleDelete(comment.id)} className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full hover:bg-red-500/40">حذف</button>
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

export default CommentManagerPage;