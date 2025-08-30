
import React, { useState, useEffect } from 'react';
import { getInvoicesByClient, ClientInvoice } from '../../data/clientData';
import Badge from '../../components/Badge';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';
import { useAuth } from '../../hooks/useAuth';

const ClientInvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    
    useEffect(() => {
        if(currentUser){
            const fetchInvoices = async () => {
                setLoading(true);
                const clientInvoices = await getInvoicesByClient(currentUser.phone);
                setInvoices(clientInvoices);
                setLoading(false);
            };
            fetchInvoices();
        }
    }, [currentUser]);

  return (
    <main className="flex-1 bg-dark-bg p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">فواتيري</h1>
            <p className="text-slate-400 mt-1">عرض وإدارة جميع فواتيرك.</p>
          </div>
        </div>

        <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-light-bg/50 text-slate-400">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">رقم الفاتورة</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ الإصدار</th>
                    <th scope="col" className="p-4 font-semibold">المبلغ</th>
                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                    <th scope="col" className="p-4 font-semibold">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center p-4 text-slate-400">جاري تحميل الفواتير...</td></tr>
                  ) : invoices.length > 0 ? (
                    invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-light-bg/30 transition-colors">
                        <td className="p-4 whitespace-nowrap font-medium text-white">
                            {invoice.id}
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-400">{invoice.issueDate}</td>
                        <td className="p-4 whitespace-nowrap text-white font-semibold">{invoice.amount.toLocaleString()} ج.م</td>
                        <td className="p-4 whitespace-nowrap">
                            <Badge color={invoice.status === 'مدفوعة' ? 'green' : 'yellow'}>
                            {invoice.status}
                            </Badge>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                            {invoice.status === 'غير مدفوعة' && (
                                <a href="/payments" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-transform transform hover:scale-105">
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                    <span>ادفع الآن</span>
                                </a>
                            )}
                        </td>
                        </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center p-8 text-slate-400">لا توجد فواتير لعرضها.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </main>
  );
};

export default ClientInvoicesPage;
