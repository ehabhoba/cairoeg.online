
import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification';

const ForgotPasswordPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [lastPassword, setLastPassword] = useState('');
    const addNotification = useNotification();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const adminPhoneNumber = '201022679250';
        const message = `مرحباً،\n\nأحاول استعادة كلمة المرور الخاصة بي.\n\nرقم الهاتف: ${phone}\nآخر كلمة مرور أتذكرها: ${lastPassword}\n\nبرجاء المساعدة.`;
        const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        addNotification('تم التوجيه!', 'سيتم فتح واتساب لإرسال طلبك إلى المدير.', 'success');
        setPhone('');
        setLastPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <a href="/">
                         <img className="mx-auto h-24 w-auto" src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" />
                    </a>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        استعادة كلمة المرور
                    </h2>
                     <p className="mt-2 text-center text-sm text-slate-400">
                        سيتم إرسال طلبك للمدير عبر واتساب للمساعدة.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="phone-number" className="sr-only">رقم هاتفك المسجل</label>
                            <input
                                id="phone-number"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="رقم هاتفك المسجل"
                            />
                        </div>
                         <div>
                            <label htmlFor="last-password" className="sr-only">آخر كلمة مرور تتذكرها (اختياري)</label>
                            <input
                                id="last-password"
                                name="last-password"
                                type="text"
                                value={lastPassword}
                                onChange={(e) => setLastPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="آخر كلمة مرور تتذكرها (اختياري)"
                            />
                        </div>
                    </div>

                    <div className="text-sm text-center">
                        <a href="/login" className="font-medium text-primary hover:text-primary/90">
                            العودة لتسجيل الدخول
                        </a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary"
                        >
                            إرسال طلب المساعدة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
