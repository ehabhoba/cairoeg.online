
import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { useNavigate } from '../hooks/useNavigate';
import { LoadingSpinner } from '../components/LoadingSpinner';


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
    const { navigate } = useNavigate();

    const passwordValidation = useMemo(() => {
        const hasLength = password.length >= 6;
        const isMatch = password && password === confirmPassword;
        const allValid = hasLength && isMatch;
        return { hasLength, isMatch, allValid };
    }, [password, confirmPassword]);
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!passwordValidation.allValid) {
            addNotification('خطأ', 'يرجى استيفاء جميع شروط كلمة المرور.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await register(name, phone, password);
            // AuthProvider will handle notifications and navigation
        } catch (error: any) {
            addNotification('خطأ في التسجيل', error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <button onClick={() => navigate('/')}>
                        <img className="mx-auto h-24 w-auto" src="https://i.postimg.cc/1RN16091/image.png" alt="Cairoeg Logo" />
                    </button>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        إنشاء حساب عميل جديد
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-400">
                        أو <button onClick={() => navigate('/login')} className="font-medium text-primary hover:text-primary/90">العودة لتسجيل الدخول</button>
                    </p>
                </div>
                 <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 shadow-lg">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-slate-300 mb-1">الاسم الكامل</label>
                            <input
                                id="full-name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="اسمك أو اسم شركتك"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone-number" className="block text-sm font-medium text-slate-300 mb-1">رقم الهاتف (سيستخدم للدخول)</label>
                            <input
                                id="phone-number"
                                name="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="01xxxxxxxxx"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="********"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1">تأكيد كلمة المرور</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-slate-700 bg-light-bg text-slate-300 placeholder-slate-500 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="********"
                            />
                        </div>

                        <div className="p-4 bg-light-bg/50 border border-slate-100/10 rounded-lg">
                            <ul className="space-y-1">
                                <PasswordRequirement isValid={passwordValidation.hasLength} text="6 أحرف على الأقل" />
                                <PasswordRequirement isValid={passwordValidation.isMatch} text="كلمتا المرور متطابقتان" />
                            </ul>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !passwordValidation.allValid}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <LoadingSpinner /> : 'إنشاء حساب'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
