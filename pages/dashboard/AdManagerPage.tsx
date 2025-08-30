
import React, { useState, useEffect, useCallback } from 'react';
import { Ad, getAllAds, updateAdStatus, createPaidAd } from '../../data/adsData';
import { useNotification } from '../../hooks/useNotification';
import Badge from '../../components/Badge';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Tab = 'pending' | 'all' | 'new_paid';

const AdManagerPage: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('pending');
    const [paidAd, setPaidAd] = useState({ title: '', description: '', link_url: '' });
    const [paidAdImage, setPaidAdImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addNotification = useNotification();

    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const allAds = await getAllAds();
            setAds(allAds);
        } catch (error) {
            addNotification('خطأ', 'فشل في تحميل الإعلانات', 'error');
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleStatusUpdate = async (id: string, status: 'active' | 'rejected') => {
        try {
            await updateAdStatus(id, status);
            addNotification('نجاح!', `تم تحديث حالة الإعلان.`, 'success');
            fetchAds();
        } catch (error) {
            addNotification('خطأ', 'فشل في تحديث حالة الإعلان.', 'error');
        }
    };

    const handlePaidAdSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paidAdImage) {
            addNotification('خطأ', 'الرجاء رفع صورة للإعلان.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await createPaidAd(paidAd, paidAdImage);
            addNotification('نجاح!', 'تم نشر الإعلان المدفوع بنجاح.', 'success');
            setPaidAd({ title: '', description: '', link_url: '' });
            setPaidAdImage(null);
            fetchAds();
            setActiveTab('all');
        } catch (error) {
            addNotification('خطأ', 'فشل في نشر الإعلان المدفوع.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    const filteredAds = ads.filter(ad => {
        if (activeTab === 'pending') return ad.status === 'pending';
        return true;
    });
    
    const getBadgeColor = (status: Ad['status']) => {
        switch (status) {
            case 'active': return 'green';
            case 'pending': return 'yellow';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };
    
    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">إدارة الإعلانات</h1>

                <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg">
                    <div className="border-b border-slate-700 flex">
                        <button onClick={() => setActiveTab('pending')} className={`px-4 py-3 font-semibold ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>الإعلانات المعلقة</button>
                        <button onClick={() => setActiveTab('all')} className={`px-4 py-3 font-semibold ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>كل الإعلانات</button>
                        <button onClick={() => setActiveTab('new_paid')} className={`px-4 py-3 font-semibold ${activeTab === 'new_paid' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}>إضافة إعلان مدفوع</button>
                    </div>

                    {activeTab === 'new_paid' ? (
                        <div className="p-6">
                            <form onSubmit={handlePaidAdSubmit} className="space-y-4 max-w-lg">
                                 <div>
                                    <label htmlFor="paidAdTitle" className="block text-sm font-medium text-slate-300">عنوان الإعلان</label>
                                    <input type="text" id="paidAdTitle" value={paidAd.title} onChange={e => setPaidAd({...paidAd, title: e.target.value})} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"/>
                                </div>
                                <div>
                                    <label htmlFor="paidAdDesc" className="block text-sm font-medium text-slate-300">الوصف</label>
                                    <input type="text" id="paidAdDesc" value={paidAd.description} onChange={e => setPaidAd({...paidAd, description: e.target.value})} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"/>
                                </div>
                                <div>
                                    <label htmlFor="paidAdLink" className="block text-sm font-medium text-slate-300">الرابط</label>
                                    <input type="url" id="paidAdLink" value={paidAd.link_url} onChange={e => setPaidAd({...paidAd, link_url: e.target.value})} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"/>
                                </div>
                                <div>
                                    <label htmlFor="paidAdImage" className="block text-sm font-medium text-slate-300">صورة الإعلان</label>
                                    <input type="file" id="paidAdImage" accept="image/*" onChange={e => setPaidAdImage(e.target.files ? e.target.files[0] : null)} required className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50">
                                    {isSubmitting ? <LoadingSpinner/> : 'نشر الإعلان المدفوع'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-light-bg/50 text-slate-400">
                                    <tr>
                                        <th className="p-4 font-semibold">الإعلان</th>
                                        <th className="p-4 font-semibold">الرابط</th>
                                        <th className="p-4 font-semibold">الحالة</th>
                                        <th className="p-4 font-semibold">النوع</th>
                                        <th className="p-4 font-semibold">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/10">
                                    {loading ? (
                                        <tr><td colSpan={5} className="p-4 text-center">جاري التحميل...</td></tr>
                                    ) : filteredAds.map(ad => (
                                        <tr key={ad.id}>
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={ad.image_url} alt={ad.title} className="w-16 h-16 object-cover rounded-md"/>
                                                <span className="font-medium text-white">{ad.title}</span>
                                            </td>
                                            <td className="p-4"><a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">زيارة</a></td>
                                            <td className="p-4"><Badge color={getBadgeColor(ad.status)}>{ad.status}</Badge></td>
                                            <td className="p-4"><Badge color={ad.is_paid ? 'blue' : 'gray'}>{ad.is_paid ? 'مدفوع' : 'مجاني'}</Badge></td>
                                            <td className="p-4 space-x-2 whitespace-nowrap">
                                                {ad.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(ad.id, 'active')} className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">موافقة</button>
                                                        <button onClick={() => handleStatusUpdate(ad.id, 'rejected')} className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">رفض</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AdManagerPage;
