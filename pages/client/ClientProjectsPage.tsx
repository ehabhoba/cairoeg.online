
import React from 'react';
import { clientProjects } from '../../data/mockClientData';
import Badge from '../../components/Badge';

const ClientProjectsPage: React.FC = () => {
  return (
    <main className="flex-1 bg-slate-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">مشاريعي</h1>
            <p className="text-slate-500 mt-1">تابع حالة جميع مشاريعك الحالية والسابقة.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="p-4 font-semibold">اسم المشروع</th>
                    <th scope="col" className="p-4 font-semibold">الحالة</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ البدء</th>
                    <th scope="col" className="p-4 font-semibold">تاريخ التسليم المتوقع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clientProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap font-medium text-slate-800">
                        {project.name}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge color={project.status === 'مكتمل' ? 'green' : 'blue'}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-500">{project.startDate}</td>
                      <td className="p-4 whitespace-nowrap text-slate-500">{project.dueDate}</td>
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
