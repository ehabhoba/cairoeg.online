
import React, { useState, useEffect } from 'react';
import { ClientInvoice } from '../data/clientData';

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (invoice: ClientInvoice) => void;
    clientPhone: string;
    invoice: ClientInvoice | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, onSave, clientPhone, invoice }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [status, setStatus] = useState<'مدفوعة' | 'غير مدفوعة'>('غير مدفوعة');
    const [issueDate, setIssueDate] = useState('');
    const [items, setItems] = useState<{ description: string; amount: number }[]>([{ description: '', amount: 0 }]);

    useEffect(() => {
        if (invoice) {
            setAmount(invoice.amount);
            setStatus(invoice.status);
            setIssueDate(invoice.issueDate);
            setItems(invoice.items || [{ description: 'مبلغ الفاتورة', amount: invoice.amount }]);
        } else {
            setAmount('');
            setStatus('غير مدفوعة');
            setIssueDate(new Date().toISOString().split('T')[0]);
            setItems([{ description: '', amount: 0 }]);
        }
    }, [invoice, isOpen]);
    
    useEffect(() => {
        const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        setAmount(totalAmount);
    }, [items]);

    const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: field === 'amount' ? Number(value) : value };
        setItems(newItems);
    };
    
    const addItem = () => setItems([...items, { description: '', amount: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const invoiceData: ClientInvoice = {
            id: invoice ? invoice.id : `INV-${Date.now()}`,
            clientPhone,
            amount: amount || 0,
            status,
            issueDate,
            items,
        };
        onSave(invoiceData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-panel-bg rounded-2xl shadow-xl p-6 m-4 max-w-2xl w-full transform transition-transform scale-95 animate-modal-enter border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-6">{invoice ? 'تعديل الفاتورة' : 'إضافة فاتورة جديدة'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">بنود الفاتورة</label>
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input type="text" placeholder="الوصف" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="flex-grow px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg focus:ring-primary focus:border-primary" required />
                                <input type="number" placeholder="المبلغ" value={item.amount || ''} onChange={e => handleItemChange(index, 'amount', e.target.value)} className="w-32 px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg focus:ring-primary focus:border-primary" required />
                                <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-400 hover:text-red-300">&times;</button>
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="text-sm text-primary hover:underline">+ إضافة بند</button>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-slate-300">المبلغ الإجمالي</label>
                             <input type="text" value={`${amount.toLocaleString()} ج.م`} readOnly className="mt-1 block w-full px-4 py-2 bg-slate-900 border border-slate-700 text-white rounded-lg" />
                        </div>
                        <div>
                             <label htmlFor="invoiceStatus" className="block text-sm font-medium text-slate-300">الحالة</label>
                             <select id="invoiceStatus" value={status} onChange={e => setStatus(e.target.value as any)} className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg focus:ring-primary focus:border-primary">
                                 <option value="غير مدفوعة">غير مدفوعة</option>
                                 <option value="مدفوعة">مدفوعة</option>
                             </select>
                        </div>
                         <div>
                             <label htmlFor="issueDate" className="block text-sm font-medium text-slate-300">تاريخ الإصدار</label>
                             <input type="date" id="issueDate" value={issueDate} onChange={e => setIssueDate(e.target.value)} required className="mt-1 block w-full px-4 py-2 bg-light-bg border border-slate-700 text-white rounded-lg focus:ring-primary focus:border-primary" />
                         </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvoiceModal;
