
import React from 'react';

const LoginPage: React.FC = () => {
    
    // In a real app, this would involve an API call.
    // Here, we simulate the role-based redirection.
    const handleLoginAsAdmin = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        window.location.hash = '#/dashboard/analytics';
    };

    const handleLoginAsClient = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        window.location.hash = '#/client/dashboard';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <a href="#/">
                        <img className="mx-auto h-24 w-auto" src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" />
                    </a>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        تسجيل الدخول إلى بوابتك
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        أو <a href="#/" className="font-medium text-primary hover:text-primary/90">العودة إلى الصفحة الرئيسية</a>
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="البريد الإلكتروني"
                                defaultValue="demo@example.com"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-slate-900 text-slate-300 placeholder-slate-500 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="كلمة المرور"
                                defaultValue="password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary bg-slate-800 border-slate-600 focus:ring-primary rounded"
                            />
                            <label htmlFor="remember-me" className="mr-2 block text-sm text-slate-400">
                                تذكرني
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:text-primary/90">
                                نسيت كلمة المرور؟
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleLoginAsAdmin}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary"
                        >
                            تسجيل الدخول كمدير
                        </button>
                        <button
                            onClick={handleLoginAsClient}
                            className="group relative w-full flex justify-center py-3 px-4 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-slate-500"
                        >
                            تسجيل الدخول كعميل
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
