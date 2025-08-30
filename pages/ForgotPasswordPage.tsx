
import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import { useNavigate } from '../hooks/useNavigate';

const ForgotPasswordPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const addNotification = useNotification();
    const { navigate } = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const adminPhoneNumber = '201022679250';
        const message = `مرحباً،\n\nأحتاج مساعدة في استعادة كلمة المرور الخاصة بحسابي.\n\nرقم الهاتف المسجل هو: ${phone}\n\nشكراً لكم.`;
        const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        addNotification('تم التوجيه!', 'سيتم فتح واتساب لإرسال طلبك إلى المدير.', 'success');
        setPhone('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <button onClick={() => navigate('/')}>
                         <img className="mx-auto h-24 w-auto" src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" />
                    </button>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        استعادة كلمة المرور
                    </h2>
                     <p className="mt-2 text-center text-sm text-slate-400">
                        أدخل رقم هاتفك المسجل وسيتم توجيهك إلى واتساب للتواصل مع المدير للمساعدة.
                    </p>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                             <label htmlFor="phone-number" className="block text-sm font-medium text-slate-300 mb-1">رقم هاتفك المسجل</label>
                            <input
                                id="phone-number"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="01xxxxxxxxx"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary"
                            >
                                إرسال طلب المساعدة
                            </button>
                        </div>
                         <div className="text-sm text-center">
                            <button type="button" onClick={() => navigate('/login')} className="font-medium text-primary hover:text-primary/90">
                                تذكرت كلمة المرور؟ العودة لتسجيل الدخول
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
