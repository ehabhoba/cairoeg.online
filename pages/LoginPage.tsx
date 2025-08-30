
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const addNotification = useNotification();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            addNotification('تم تسجيل الدخول بنجاح!', 'جاري توجيهك إلى لوحة التحكم...', 'success');
        } catch (error: any) {
            addNotification('خطأ في تسجيل الدخول', error.message, 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                 <div className="text-center mb-8">
                    <a href="/">
                        <img className="mx-auto h-24 w-auto" src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" />
                    </a>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        تسجيل الدخول إلى حسابك
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        أو <a href="/" className="font-medium text-primary hover:text-primary/90">العودة إلى الصفحة الرئيسية</a>
                    </p>
                </div>

                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="البريد الإلكتروني"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">كلمة المرور</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="كلمة المرور"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <a href="/register" className="font-medium text-primary hover:text-primary/90">
                                ليس لديك حساب؟ سجل الآن
                            </a>
                            <a href="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                                نسيت كلمة المرور؟
                            </a>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary disabled:opacity-50"
                            >
                                {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
