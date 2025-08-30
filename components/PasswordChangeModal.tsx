
import React, { useState } from 'react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (newPassword.length < 6) {
            setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }
        setError('');
        onConfirm(newPassword);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-panel-bg rounded-2xl shadow-xl p-6 m-4 max-w-sm w-full animate-modal-enter border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">تغيير كلمة مرور العميل</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-300">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-300">تأكيد كلمة المرور</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-light-bg border border-slate-700 text-white rounded-lg"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">إلغاء</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">حفظ التغييرات</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
