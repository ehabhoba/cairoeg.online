
import React, { useState, useMemo } from 'react';
import { clientProjects, type ClientProject } from '../../data/mockClientData';
import Badge from '../../components/Badge';

type Status = 'الكل' | 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
const statuses: Status[] = ['الكل', 'قيد التنفيذ', 'مكتمل', 'متوقف'];

const ClientProjectsPage: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState<Status>('الكل');

    const filteredProjects = useMemo(() => {
        if (statusFilter === 'الكل') {
            return clientProjects;
        }
        return clientProjects.filter(project => project.status === statusFilter);
    }, [statusFilter]);

    const getStatusColor = (status: ClientProject['status']) => {
        switch (status) {
            case 'مكتمل': return 'green';
            case 'قيد التنفيذ': return 'blue';
            case 'متوقف': return 'gray';
            default: return 'gray';
        }
    };

  return (
    <main className="flex-1 bg-dark-bg p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">مشاريعي</h1>
            <p className="text-slate-400 mt-1">تابع حالة جميع مشاريعك الحالية والسابقة.</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-4 flex items-center gap-2 bg-light-bg p-1 rounded-lg border border-slate-700/50 w-full md:w-auto">
            {statuses.map(status => (
                <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors w-full md:w-auto ${statusFilter === status ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
                >
                    {status}
                </button>
            ))}
        </div>

        <div className="bg-panel-bg rounded-2xl border border-slate-100/10 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-light-bg/50 text-slate-400">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">اسم المشروع</th>
                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ البدء</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ التسليم المتوقع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-light-bg/30 transition-colors">
                      <td className="p-4 whitespace-nowrap font-medium text-white">
                        {project.name}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge color={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-400">{project.startDate}</td>
                      <td className="p-4 whitespace-nowrap text-slate-400">{project.dueDate}</td>
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

export default ClientProjectsPage;
