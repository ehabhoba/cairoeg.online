
import React from 'react';
import { paymentMethods } from '../data/siteData';
import SectionHeader from '../components/SectionHeader';
import { useNotification } from '../hooks/useNotification';

import { WhatsappIcon } from '../components/icons/WhatsappIcon';
import { BankIcon } from '../components/icons/BankIcon';
import { BitcoinIcon } from '../components/icons/BitcoinIcon';
import { EthereumIcon } from '../components/icons/EthereumIcon';
import { LitecoinIcon } from '../components/icons/LitecoinIcon';
import { CopyIcon } from '../components/icons/CopyIcon';

const PaymentsPage: React.FC = () => {
    const addNotification = useNotification();

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        addNotification('تم النسخ!', `تم نسخ ${label} بنجاح.`, 'success', 3000);
    };

    return (
        <div className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader 
                    title="طرق الدفع المتاحة"
                    subtitle="اختر الطريقة الأنسب لك لإتمام عملية الدفع بسهولة وأمان."
                />
                
                <div className="space-y-8">
                    {/* Vodafone Cash */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center mb-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_Cash_logo.svg/1280px-Vodafone_Cash_logo.svg.png" alt="Vodafone Cash" className="w-24 ml-4" />
                            <div>
                                <h3 className="text-2xl font-bold text-white">فودافون كاش</h3>
                                <div className="flex items-center mt-1">
                                    <p className="text-lg text-slate-300">{paymentMethods.vodafoneCash.number}</p>
                                    <button onClick={() => handleCopy(paymentMethods.vodafoneCash.number, 'رقم فودافون كاش')} className="mr-2 p-1 text-slate-400 hover:text-white"><CopyIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {paymentMethods.vodafoneCash.links.map(link => (
                                <a key={link.amount} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors">
                                    {link.amount === 'عام' ? 'رابط دفع عام' : `دفع ${link.amount}`}
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    {/* InstaPay */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center">
                             <img src="https://instapay.gov.eg/wp-content/uploads/2023/08/instapay-high-resolution-logo-transparent.png" alt="InstaPay" className="w-24 ml-4" />
                            <div>
                                <h3 className="text-2xl font-bold text-white">إنستا باي (InstaPay)</h3>
                                 <div className="flex items-center mt-1">
                                    <p className="text-lg text-slate-300">{paymentMethods.instaPay.number}</p>
                                    <button onClick={() => handleCopy(paymentMethods.instaPay.number, 'رقم إنستا باي')} className="mr-2 p-1 text-slate-400 hover:text-white"><CopyIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Crypto */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <h3 className="text-2xl font-bold text-white mb-4">العملات الرقمية (Crypto)</h3>
                        <div className="space-y-4">
                            {paymentMethods.crypto.map(c => (
                                <div key={c.name} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {c.name.includes('Bitcoin') && <BitcoinIcon className="w-6 h-6 text-gold ml-3" />}
                                        {c.name.includes('Ethereum') && <EthereumIcon className="w-6 h-6 text-slate-400 ml-3" />}
                                        {c.name.includes('Litecoin') && <LitecoinIcon className="w-6 h-6 text-slate-300 ml-3" />}
                                        <span className="font-semibold text-white">{c.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm text-slate-400 truncate hidden sm:block">{c.address}</p>
                                        <button onClick={() => handleCopy(c.address, `عنوان ${c.name}`)} className="mr-2 p-1 text-slate-400 hover:text-white"><CopyIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Bank Transfer */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center mb-4">
                            <BankIcon className="w-8 h-8 text-primary ml-4" />
                            <h3 className="text-2xl font-bold text-white">التحويل البنكي (Bank Transfer)</h3>
                        </div>
                        <div className="space-y-2 text-slate-300">
                           <p><strong>اسم الحساب:</strong> {paymentMethods.bankTransfer.accountName}</p>
                           <p><strong>اسم البنك:</strong> {paymentMethods.bankTransfer.bankName}</p>
                           <p className="flex items-center"><strong>رقم الحساب:</strong> {paymentMethods.bankTransfer.accountNumber} <button onClick={() => handleCopy(paymentMethods.bankTransfer.accountNumber, 'رقم الحساب')} className="mr-2 p-1 text-slate-400 hover:text-white"><CopyIcon className="w-4 h-4" /></button></p>
                           <p className="flex items-center"><strong>IBAN:</strong> {paymentMethods.bankTransfer.iban} <button onClick={() => handleCopy(paymentMethods.bankTransfer.iban, 'IBAN')} className="mr-2 p-1 text-slate-400 hover:text-white"><CopyIcon className="w-4 h-4" /></button></p>
                           <p><strong>العملة:</strong> {paymentMethods.bankTransfer.currency}</p>
                        </div>
                    </div>
                     <div className="text-center pt-6">
                        <p className="text-slate-400">📝 برجاء إرسال إثبات الدفع على واتساب بعد التحويل لتأكيد الطلب وتفعيله.</p>
                        <a href={`https://wa.me/201022679250?text=${encodeURIComponent('مرحباً، لقد قمت بعملية دفع وأود تأكيدها.')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                            <WhatsappIcon className="w-5 h-5"/>
                            <span>تأكيد عبر واتساب</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
