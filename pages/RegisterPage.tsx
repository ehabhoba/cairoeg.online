import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';

const PasswordRequirement: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <li className={`flex items-center text-sm ${isValid ? 'text-green-400' : 'text-slate-400'}`}>
        {isValid ? <CheckCircleIcon className="w-4 h-4 ml-2" /> : <XCircleIcon className="w-4 h-4 ml-2" />}
        <span>{text}</span>
    </li>
);

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const addNotification = useNotification();

    const passwordValidation = useMemo(() => {
        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const isMatch = password && password === confirmPassword;
        const score = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;
        const allValid = score === 4 && isMatch;
        return { hasLength, hasUpper, hasLower, hasNumber, isMatch, allValid, score };
    }, [password, confirmPassword]);
    
    const strengthColor = () => {
        switch (passwordValidation.score) {
            case 1: return 'bg-red-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-green-500';
            default: return 'bg-slate-700';
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!passwordValidation.allValid) {
            addNotification('خطأ', 'يرجى استيفاء جميع شروط كلمة المرور.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await register(name, phone, password, 'client');
            addNotification('نجاح!', 'تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.', 'success');
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.history.pushState({}, '', '/login');
                window.dispatchEvent(new Event('popstate'));
            }, 2000);
        } catch (error: any) {
            addNotification('خطأ في التسجيل', error.message, 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <a href="/">
                        <img className="mx-auto h-24 w-auto" src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" />
                    </a>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        إنشاء حساب عميل جديد
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        أو <a href="/login" className="font-medium text-primary hover:text-primary/90">العودة لتسجيل الدخول</a>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                         <div>
                            <label htmlFor="full-name" className="sr-only">الاسم الكامل</label>
                            <input
                                id="full-name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="الاسم الكامل"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone-number" className="sr-only">رقم الهاتف</label>
                            <input
                                id="phone-number"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="رقم الهاتف"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="كلمة المرور"
                            />
                        </div>
                         <div>
                            <label htmlFor="confirm-password" className="sr-only">تأكيد كلمة المرور</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="تأكيد كلمة المرور"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-light-bg/50 border border-slate-100/10 rounded-lg">
                        <p className="text-sm font-semibold text-white mb-2">شروط كلمة المرور:</p>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${strengthColor()}`} style={{ width: `${passwordValidation.score * 25}%` }}></div>
                        </div>
                        <ul className="space-y-1">
                            <PasswordRequirement isValid={passwordValidation.hasLength} text="8 أحرف على الأقل" />
                            <PasswordRequirement isValid={passwordValidation.hasUpper} text="حرف كبير واحد على الأقل (A-Z)" />
                            <PasswordRequirement isValid={passwordValidation.hasLower} text="حرف صغير واحد على الأقل (a-z)" />
                            <PasswordRequirement isValid={passwordValidation.hasNumber} text="رقم واحد على الأقل (0-9)" />
                            <PasswordRequirement isValid={passwordValidation.isMatch} text="كلمتا المرور متطابقتان" />
                        </ul>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !passwordValidation.allValid}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;