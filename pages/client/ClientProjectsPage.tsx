
import React, { useState, useMemo, useEffect } from 'react';
import { getProjectsByClient, type ClientProject } from '../../data/clientData';
import Badge from '../../components/Badge';
import { useAuth } from '../../hooks/useAuth';

type Status = 'الكل' | 'قيد التنفيذ' | 'مكتمل' | 'متوقف';
const statuses: Status[] = ['الكل', 'قيد التنفيذ', 'مكتمل', 'متوقف'];

const ClientProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<ClientProject[]>([]);
    const [statusFilter, setStatusFilter] = useState<Status>('الكل');
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    
    useEffect(() => {
        if(currentUser){
            const fetchProjects = async () => {
                setLoading(true);
                const clientProjects = await getProjectsByClient(currentUser.phone);
                setProjects(clientProjects);
                setLoading(false);
            };
            fetchProjects();
        }
    }, [currentUser]);


    const filteredProjects = useMemo(() => {
        if (statusFilter === 'الكل') {
            return projects;
        }
        return projects.filter(project => project.status === statusFilter);
    }, [statusFilter, projects]);

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10">
                    {loading ? (
                        <tr><td colSpan={3} className="text-center p-4 text-slate-400">جاري تحميل المشاريع...</td></tr>
                    ) : filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <tr key={project.id}>
                                <td className="p-4 whitespace-nowrap font-medium text-white">
                                    <a href={`/client/project/${project.id}`} className="hover:text-primary transition-colors">
                                        {project.name}
                                    </a>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <Badge color={getStatusColor(project.status)}>
                                    {project.status}
                                    </Badge>
                                </td>
                                <td className="p-4 whitespace-nowrap text-slate-400">{project.startDate}</td>
                            </tr>
                        ))
                    ) : (
                         <tr><td colSpan={3} className="text-center p-8 text-slate-400">لا توجد مشاريع تطابق هذا الفلتر.</td></tr>
                    )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </main>
  );
};

export default ClientProjectsPage;
