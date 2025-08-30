
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { createAd, getClientAds, Ad } from '../../data/adsData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';

const ClientAdsPage: React.FC = () => {
    const { currentUser } = useAuth();
    const addNotification = useNotification();
    const [myAds, setMyAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newAd, setNewAd] = useState({ title: '', description: '', link_url: '' });
    const [adImage, setAdImage] = useState<File | null>(null);

    const fetchMyAds = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const ads = await getClientAds(currentUser.id);
            setMyAds(ads);
        } catch (error) {
            addNotification('خطأ', 'فشل في تحميل إعلاناتك.', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentUser, addNotification]);

    useEffect(() => {
        fetchMyAds();
    }, [fetchMyAds]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !adImage) {
            addNotification('خطأ', 'الرجاء إكمال جميع الحقول ورفع صورة.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await createAd({ ...newAd, user_id: currentUser.id }, adImage);
            addNotification('نجاح!', 'تم إرسال إعلانك للمراجعة.', 'success');
            setNewAd({ title: '', description: '', link_url: '' });
            setAdImage(null);
            (e.target as HTMLFormElement).reset(); // Reset file input
            fetchMyAds();
        } catch (error) {
            addNotification('خطأ', 'فشل في إنشاء الإعلان.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
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
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h1 className="text-3xl font-bold text-white mb-2">إعلاناتي</h1>
                    <p className="text-slate-400 mb-6">أنشئ إعلانًا مجانيًا لخدمتك أو منتجك ليظهر في صفحة إعلانات المنصة بعد الموافقة.</p>
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="adTitle" className="block text-sm font-medium text-slate-300">عنوان الإعلان</label>
                                <input type="text" id="adTitle" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"/>
                            </div>
                             <div>
                                <label htmlFor="adDesc" className="block text-sm font-medium text-slate-300">وصف قصير</label>
                                <input type="text" id="adDesc" value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"/>
                            </div>
                             <div>
                                <label htmlFor="adLink" className="block text-sm font-medium text-slate-300">رابط (الموقع، صفحة فيسبوك، إلخ)</label>
                                <input type="url" id="adLink" value={newAd.link_url} onChange={e => setNewAd({...newAd, link_url: e.target.value})} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"/>
                            </div>
                            <div>
                                <label htmlFor="adImage" className="block text-sm font-medium text-slate-300">صورة الإعلان</label>
                                <input type="file" id="adImage" accept="image/*" onChange={e => setAdImage(e.target.files ? e.target.files[0] : null)} required className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50">
                                {isSubmitting ? <LoadingSpinner/> : 'إرسال للمراجعة'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-6">سجل إعلاناتي</h2>
                    <div className="bg-panel-bg rounded-2xl border border-slate-100/10 overflow-hidden">
                        {loading ? (
                            <div className="p-6 text-center text-slate-400">جاري تحميل إعلاناتك...</div>
                        ) : myAds.length > 0 ? (
                            <ul className="divide-y divide-slate-100/10">
                                {myAds.map(ad => (
                                    <li key={ad.id} className="p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <img src={ad.image_url} alt={ad.title} className="w-20 h-20 object-cover rounded-lg"/>
                                            <div>
                                                <p className="font-semibold text-white">{ad.title}</p>
                                                <p className="text-sm text-slate-400">{ad.description}</p>
                                            </div>
                                        </div>
                                        <Badge color={getBadgeColor(ad.status)}>{ad.status}</Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <div className="p-8 text-center text-slate-400">لم تقم بإنشاء أي إعلانات بعد.</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ClientAdsPage;
