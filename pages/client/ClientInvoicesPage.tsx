
import React from 'react';
import { clientInvoices } from '../../data/mockClientData';
import Badge from '../../components/Badge';

const ClientInvoicesPage: React.FC = () => {
  return (
    <main className="flex-1 bg-slate-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">فواتيري</h1>
            <p className="text-slate-500 mt-1">عرض وإدارة جميع فواتيرك.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">رقم الفاتورة</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ الإصدار</th>
                    <th scope="col" className="p-4 font-semibold">المبلغ</th>
                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                    <th scope="col" className="p-4 font-semibold">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clientInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {invoice.id}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-500">{invoice.issueDate}</td>
                      <td className="p-4 whitespace-nowrap text-slate-800 font-semibold">{invoice.amount.toLocaleString()} ج.م</td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge color={invoice.status === 'مدفوعة' ? 'green' : 'yellow'}>
                          {invoice.status}
                        </Badge>
                      </td>
                       <td className="p-4 whitespace-nowrap">
                        {invoice.status === 'غير مدفوعة' && (
                             <a href="#/payments" className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                                ادفع الآن
                            </a>
                        )}
                      </td>
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

export default ClientInvoicesPage;
