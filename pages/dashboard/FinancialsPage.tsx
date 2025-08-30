
import React, { useState, useEffect, useMemo } from 'react';
import { getFinancials, FinancialData } from '../../data/financialsData';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';

const FinancialsPage: React.FC = () => {
    const [financials, setFinancials] = useState<FinancialData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getFinancials();
            setFinancials(data);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredInvoices = useMemo(() => {
        if (!financials) return [];
        return financials.invoices.filter(invoice =>
            invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.id.toString().includes(searchTerm)
        );
    }, [searchTerm, financials]);

    if (loading) {
        return <main className="flex-1 bg-dark-bg p-6 flex items-center justify-center"><LoadingSpinner /></main>;
    }

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">المالية</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                        <p className="text-slate-400">إجمالي الإيرادات (المدفوعة)</p>
                        <p className="text-3xl font-bold text-green-400 mt-1">{financials?.totalRevenue.toLocaleString()} ج.م</p>
                    </div>
                    <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                        <p className="text-slate-400">المبالغ المستحقة (غير مدفوعة)</p>
                        <p className="text-3xl font-bold text-yellow-400 mt-1">{financials?.unpaidAmount.toLocaleString()} ج.م</p>
                    </div>
                     <div className="bg-panel-bg p-6 rounded-2xl border border-slate-700/50">
                        <p className="text-slate-400">عدد الفواتير</p>
                        <p className="text-3xl font-bold text-white mt-1">{financials?.invoiceCount}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="ابحث باسم العميل أو رقم الفاتورة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-light-bg border border-slate-700/50 rounded-lg text-white"
                    />
                </div>
                
                <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-light-bg/50 text-slate-400">
                                <tr>
                                    <th className="p-4 font-semibold">رقم الفاتورة</th>
                                    <th className="p-4 font-semibold">العميل</th>
                                    <th className="p-4 font-semibold">المبلغ</th>
                                    <th className="p-4 font-semibold">الحالة</th>
                                    <th className="p-4 font-semibold">تاريخ الإصدار</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/10">
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td className="p-4 text-white font-medium">{inv.id}</td>
                                        <td className="p-4 text-slate-300">{inv.client_name}</td>
                                        <td className="p-4 text-white">{inv.amount.toLocaleString()} ج.م</td>
                                        <td className="p-4"><Badge color={inv.status === 'paid' ? 'green' : 'yellow'}>{inv.status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}</Badge></td>
                                        <td className="p-4 text-slate-400">{new Date(inv.issue_date).toLocaleDateString('ar-EG')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FinancialsPage;
