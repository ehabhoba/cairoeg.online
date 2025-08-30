
import React, { useState, useMemo, useEffect } from 'react';
import { User, getAllClients } from '../data/userData';
import Badge from '../components/Badge';
import { PlusIcon } from '../components/icons/PlusIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { useAuth } from '../hooks/useAuth';

type Status = 'Active' | 'Inactive' | 'All';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>('All');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
        setLoading(true);
        const allClients = await getAllClients();
        setClients(allClients);
        setLoading(false);
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
        if (client.role === 'admin') return false; // Exclude admin
        const name = client.name || '';
        const phone = client.phone || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              phone.toLowerCase().includes(searchTerm.toLowerCase());
        // Note: status is not part of user data yet, so this filter is disabled for now.
        // const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
        return matchesSearch;
    });
  }, [searchTerm, clients]);

  if (loading) {
    return <div className="p-6 text-white">جاري تحميل العملاء...</div>;
  }

  return (
    <main className="flex-1 bg-dark-bg p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة العملاء</h1>
            <p className="text-slate-400 mt-1">عرض، بحث، وإدارة قائمة العملاء الخاصة بك.</p>
          </div>
          <a href="/register" className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">
            <PlusIcon className="w-5 h-5" />
            <span>إضافة عميل</span>
          </a>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو رقم الهاتف..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-light-bg border border-slate-700/50 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-primary" 
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            {/* Status filter can be added back when status is part of User data */}
        </div>

        {/* Clients Table */}
        <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-light-bg/50 text-slate-400">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">اسم العميل</th>
                    <th scope="col" className="p-4 font-semibold">رقم الهاتف</th>
                    <th scope="col" className="p-4 font-semibold">الشركة</th>
                    <th scope="col" className="p-4 font-semibold">الموقع الإلكتروني</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10">
                  {filteredClients.map((client) => (
                    <tr key={client.phone} className="hover:bg-light-bg/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard/clients/${client.phone}`}>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white">
                                {client.name.charAt(0)}
                            </div>
                            <span className="font-medium text-white">{client.name}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-400">{client.phone}</td>
                      <td className="p-4 whitespace-nowrap text-slate-400">{client.companyName || '-'}</td>
                      <td className="p-4 whitespace-nowrap text-slate-400">
                        {client.websiteUrl ? <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary" onClick={e => e.stopPropagation()}>{client.websiteUrl}</a> : '-'}
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
