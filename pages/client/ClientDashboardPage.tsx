
import React, { useState, useEffect } from 'react';
import { getProjectsByClient, ClientProject } from '../../data/clientData';
import { getInvoicesByClient, ClientInvoice } from '../../data/clientData';
import { getNotifications, Notification } from '../../data/notificationsData';
import { ProjectIcon } from '../../components/icons/ProjectIcon';
import { InvoiceIcon } from '../../components/icons/InvoiceIcon';
import Badge from '../../components/Badge';
import { useAuth } from '../../hooks/useAuth';
import { BellIcon } from '../../components/icons/BellIcon';

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, iconBgColor: string }> = ({ title, value, icon, iconBgColor }) => {
    return (
        <div className="relative bg-gradient-to-br from-light-bg to-panel-bg p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg border ${iconBgColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};


const ClientDashboardPage: React.FC = () => {
    const { currentUser } = useAuth();
    const [projects, setProjects] = useState<ClientProject[]>([]);
    const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    useEffect(() => {
        if (currentUser) {
            const fetchData = async () => {
                const clientProjects = await getProjectsByClient(currentUser.phone);
                const clientInvoices = await getInvoicesByClient(currentUser.phone);
                const clientNotifications = await getNotifications(currentUser.phone);
                setProjects(clientProjects);
                setInvoices(clientInvoices);
                setNotifications(clientNotifications.slice(0, 4)); // Get latest 4
            };
            fetchData();
        }
    }, [currentUser]);

    const activeProjects = projects.filter(p => p.status === 'قيد التنفيذ').length;
    const unpaidInvoices = invoices.filter(i => i.status === 'غير مدفوعة').length;
    const latestProject = projects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">مرحباً بك، {currentUser?.name || 'عميلنا العزيز'}</h1>
                <p className="text-slate-400 mb-6">هذه هي لوحة التحكم الخاصة بك لمتابعة كل ما يتعلق بأعمالك معنا.</p>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <StatCard 
                        title="المشاريع النشطة"
                        value={activeProjects}
                        icon={<ProjectIcon />}
                        iconBgColor="bg-primary/10 text-primary border-primary/20"
                    />
                     <StatCard 
                        title="الفواتير المستحقة"
                        value={unpaidInvoices}
                        icon={<InvoiceIcon />}
                        iconBgColor="bg-gold/10 text-gold border-gold/20"
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Project */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-light-bg to-panel-bg p-6 rounded-2xl border border-slate-700/50 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">آخر تحديث لمشاريعك</h3>
                        {latestProject ? (
                            <div>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-200 text-lg">{latestProject.name}</h4>
                                    <Badge color={latestProject.status === 'مكتمل' ? 'green' : 'blue'}>{latestProject.status}</Badge>
                                </div>
                                <p className="text-sm text-slate-400 mt-2">تاريخ التسليم المتوقع: {latestProject.dueDate}</p>
                                 <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <a href="/client/projects" className="text-sm font-semibold text-primary-light hover:underline mt-4 inline-block">عرض كل المشاريع →</a>
                            </div>
                        ) : (
                             <div className="text-center py-8">
                                 <ProjectIcon className="mx-auto w-12 h-12 text-slate-600 mb-2" />
                                <p className="text-slate-400">لا توجد مشاريع حالياً.</p>
                                 <a href="/client/requests" className="text-sm font-semibold text-primary-light hover:underline mt-2 inline-block">اطلب أول خدمة لك</a>
                            </div>
                        )}
                    </div>
                     <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">إجراءات سريعة</h3>
                        <div className="space-y-3">
                            <a href="/client/requests" className="block w-full text-center px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">تقديم طلب جديد</a>
                            <a href="/client/profile" className="block w-full text-center px-4 py-2.5 bg-light-bg/50 text-slate-200 font-semibold rounded-lg hover:bg-light-bg transition-colors">تعديل ملفي الشخصي</a>
                             <a href="/client/support" className="block w-full text-center px-4 py-2.5 bg-light-bg/50 text-slate-200 font-semibold rounded-lg hover:bg-light-bg transition-colors">طلب دعم فني</a>
                        </div>
                    </div>

                    {/* Notifications */}
                     <div className="lg:col-span-3 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                        <h3 className="text-lg font-bold text-white mb-4">أحدث الإشعارات</h3>
                         {notifications.length > 0 ? (
                            <ul className="space-y-4">
                                {notifications.map(n => (
                                    <li key={n.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary/20 text-primary rounded-full">
                                            <BellIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-200">{n.message}</p>
                                            <p className="text-xs text-slate-500">{new Date(n.timestamp).toLocaleString('ar-EG')}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-400 text-center py-4">لا توجد إشعارات جديدة.</p>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
};

export default ClientDashboardPage;
