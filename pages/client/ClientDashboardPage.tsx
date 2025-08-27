
import React from 'react';
import { clientProjects, clientInvoices } from '../../data/mockClientData';
import { ProjectIcon } from '../../components/icons/ProjectIcon';
import { InvoiceIcon } from '../../components/icons/InvoiceIcon';
import Badge from '../../components/Badge';

const ClientDashboardPage: React.FC = () => {
    const activeProjects = clientProjects.filter(p => p.status === 'قيد التنفيذ').length;
    const unpaidInvoices = clientInvoices.filter(i => i.status === 'غير مدفوعة').length;

    const latestProject = clientProjects[0];

    return (
        <main className="flex-1 bg-slate-50 p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">مرحباً بك، عميلنا العزيز</h1>
                <p className="text-slate-500 mb-6">هذه هي لوحة التحكم الخاصة بك لمتابعة كل ما يتعلق بمشاريعك.</p>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">المشاريع النشطة</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{activeProjects}</p>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                            <ProjectIcon />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">الفواتير المستحقة</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{unpaidInvoices}</p>
                        </div>
                        <div className="w-12 h-12 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-lg">
                            <InvoiceIcon />
                        </div>
                    </div>
                </div>
                
                {/* Recent Project & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">آخر تحديث لمشاريعك</h3>
                        {latestProject ? (
                            <div>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-slate-700">{latestProject.name}</h4>
                                    <Badge color={latestProject.status === 'مكتمل' ? 'green' : 'blue'}>{latestProject.status}</Badge>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">تاريخ التسليم المتوقع: {latestProject.dueDate}</p>
                                <a href="#/client/projects" className="text-sm font-semibold text-blue-600 hover:underline mt-4 inline-block">عرض كل المشاريع</a>
                            </div>
                        ) : (
                            <p className="text-slate-500">لا توجد مشاريع حالياً.</p>
                        )}
                    </div>
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">إجراءات سريعة</h3>
                        <div className="space-y-3">
                            <a href="#/client/invoices" className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">عرض الفواتير</a>
                            <a href="#/client/support" className="block w-full text-center px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">طلب دعم فني</a>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default ClientDashboardPage;
