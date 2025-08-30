
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { updateUser, getBusinessProfile, updateBusinessProfile } from '../../data/userData';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const ClientProfilePage: React.FC = () => {
    const { currentUser } = useAuth();
    const addNotification = useNotification();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [instagramHandle, setInstagramHandle] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setPhone(currentUser.phone);
            
            const fetchProfile = async () => {
                const profile = await getBusinessProfile(currentUser.id);
                if (profile) {
                    setCompanyName(profile.company_name || '');
                    setWebsiteUrl(profile.page_link || '');
                    setLogoUrl(profile.logo_url || '');
                    setFacebookUrl(profile.facebook_url || '');
                    setInstagramHandle(profile.instagram_handle || '');
                }
            };
            fetchProfile();
        }
    }, [currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        
        setIsLoading(true);
        try {
            // Update main user info (name, bio)
            await updateUser(currentUser.id, { name });

            // Update business profile info
            await updateBusinessProfile(currentUser.id, {
                company_name: companyName,
                page_link: websiteUrl,
                logo_url: logoUrl,
                facebook_url: facebookUrl,
                instagram_handle: instagramHandle,
            });
            
            addNotification('نجاح', 'تم تحديث ملفك الشخصي بنجاح.', 'success');
        } catch (error) {
            addNotification('خطأ', 'فشل تحديث الملف الشخصي.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">ملفي الشخصي</h1>
                <div className="bg-panel-bg p-8 rounded-2xl border border-slate-100/10 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <img src={logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1D4ED8&color=fff&size=128`} alt="logo" className="w-24 h-24 rounded-full object-cover bg-light-bg border-2 border-slate-700" />
                            <div className="flex-grow">
                                <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-300">رابط الشعار (اللوجو)</label>
                                <input type="url" id="logoUrl" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="https://example.com/logo.png" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300">الاسم الكامل</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">رقم الهاتف (للعرض فقط)</label>
                                <input type="tel" id="phone" value={phone} readOnly className="mt-1 block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 rounded-lg shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-slate-300">اسم الشركة</label>
                                <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                             <div>
                                <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-300">الموقع الإلكتروني</label>
                                <input type="url" id="websiteUrl" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="https://example.com" />
                            </div>
                            <div>
                                <label htmlFor="facebookUrl" className="block text-sm font-medium text-slate-300">رابط صفحة فيسبوك</label>
                                <input type="url" id="facebookUrl" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="https://facebook.com/yourpage" />
                            </div>
                            <div>
                                <label htmlFor="instagramHandle" className="block text-sm font-medium text-slate-300">معرف انستغرام</label>
                                <input type="text" id="instagramHandle" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary" placeholder="yourhandle" />
                            </div>
                        </div>
                        <div className="pt-4">
                             <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary disabled:opacity-50"
                            >
                                {isLoading ? <LoadingSpinner /> : 'حفظ التغييرات'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ClientProfilePage;
