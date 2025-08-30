
import React, { useState, useEffect } from 'react';
import { getKpiData, getMonthlyRevenue, KpiData, MonthlyRevenue } from '../../data/analyticsData';
import { CurrencyDollarIcon } from '../../components/icons/CurrencyDollarIcon';
import { UsersGroupIcon } from '../../components/icons/UsersGroupIcon';
import Badge from '../../components/Badge';
import { ClientRequest, getAllRequests } from '../../data/requestsData';
import { Notification, getNotifications } from '../../data/notificationsData';
import { BellIcon } from '../../components/icons/BellIcon';
import { ClipboardDocumentListIcon } from '../../components/icons/ClipboardDocumentListIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';


const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => {
    return (
        <div className="relative bg-gradient-to-br from-light-bg to-panel-bg p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20">
                    {icon}
                </div>
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { month: string, revenue: number }[] }> = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1); // Avoid division by zero
    return (
        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-4">نظرة عامة على الإيرادات الشهرية</h3>
            <div className="flex items-end justify-between gap-2 h-64 pt-4">
                {data.map(({ month, revenue }) => (
                    <div key={month} className="relative flex flex-col items-center flex-1 h-full group">
                         <div className="absolute -top-8 bg-dark-bg text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            {revenue.toLocaleString()} ج.م
                        </div>
                        <div
                            className="w-full bg-gradient-to-t from-primary/80 to-accent/80 rounded-t-lg group-hover:opacity-100 opacity-75 transition-all duration-300"
                            style={{ height: `${(revenue / maxRevenue) * 100}%` }}
                        ></div>
                        <span className="text-xs text-slate-400 mt-2">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardOverviewPage: React.FC = () => {
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
    const [recentRequests, setRecentRequests] = useState<ClientRequest[]>([]);
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [kpis, revenue, requests, notifications] = await Promise.all([
                getKpiData(),
                getMonthlyRevenue(),
                getAllRequests(),
                getNotifications('admin')
            ]);
            setKpiData(kpis);
            setMonthlyRevenue(revenue);
            setRecentRequests(requests.slice(0, 5));
            setRecentNotifications(notifications.slice(0, 5));
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="flex-1 bg-dark-bg p-6 flex items-center justify-center">
                <LoadingSpinner />
            </main>
        )
    }

  return (
    <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">نظرة عامة</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <StatCard 
                    title="إجمالي الإيرادات"
                    value={`${kpiData?.totalRevenue.toLocaleString() || 0} ج.م`}
                    icon={<CurrencyDollarIcon />}
                />
                 <StatCard 
                    title="إجمالي العملاء"
                    value={kpiData?.clientCount.toString() || '0'}
                    icon={<UsersGroupIcon />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <BarChart data={monthlyRevenue} />
                </div>
                
                 <div className="lg:col-span-2 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">أحدث الطلبات</h3>
                    {recentRequests.length > 0 ? (
                        <ul className="space-y-4">
                            {recentRequests.map(req => (
                                <li key={req.id} className="flex items-center gap-3">
                                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-primary/20 text-primary rounded-full">
                                        <ClipboardDocumentListIcon className="w-5 h-5"/>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-slate-200">{req.details.title}</p>
                                        <p className="text-xs text-slate-500">من العميل: {req.clientPhone}</p>
                                    </div>
                                    <Badge color={req.status === 'قيد المراجعة' ? 'yellow' : 'gray'}>{req.status}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-slate-400 text-center py-4">لا توجد طلبات جديدة.</p>}
                </div>
                
                <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">أحدث الإشعارات</h3>
                    {recentNotifications.length > 0 ? (
                        <ul className="space-y-4">
                            {recentNotifications.map(n => (
                                <li key={n.id} className="flex items-center gap-3">
                                    <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-gold/10 text-gold rounded-full">
                                       <BellIcon className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-200">{n.message}</p>
                                        <p className="text-xs text-slate-500">{new Date(n.timestamp).toLocaleString('ar-EG')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-slate-400 text-center py-4">لا توجد إشعارات جديدة.</p>}
                </div>
            </div>
        </div>
    </main>
  );
};

export default DashboardOverviewPage;
