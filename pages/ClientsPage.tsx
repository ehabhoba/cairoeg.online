import React from 'react';
import { UsersIcon } from '../components/icons/UsersIcon';
import { mockClients } from '../data/mockClients';
import Badge from '../components/Badge';
import { PlusIcon } from '../components/icons/PlusIcon';
import { PencilIcon } from '../components/icons/PencilIcon';

const ClientsPage: React.FC = () => {
  return (
    <main className="flex-1 bg-slate-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">إدارة العملاء</h1>
            <p className="text-slate-500 mt-1">عرض، بحث، وإدارة قائمة العملاء الخاصة بك.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <div className="relative">
              <input type="text" placeholder="ابحث عن عميل..." className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-5 h-5" />
              <span>إضافة عميل</span>
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">اسم العميل</th>
                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                    <th scope="col" className="p-4 font-semibold">البريد الإلكتروني</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ الانضمام</th>
                    <th scope="col" className="p-4 font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mockClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                {client.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-800">{client.name}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge color={client.status === 'Active' ? 'green' : 'gray'}>
                          {client.status === 'Active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-500">{client.email}</td>
                      <td className="p-4 whitespace-nowrap text-slate-500">{client.joinDate}</td>
                      <td className="p-4 whitespace-nowrap">
                        <button className="p-2 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors" aria-label={`Edit ${client.name}`}>
                          <PencilIcon className="w-5 h-5" />
                        </button>
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

export default ClientsPage;