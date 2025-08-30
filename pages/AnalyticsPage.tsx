import React from 'react';
import { kpiData, monthlyRevenue, campaignPerformance, recentSignups } from '../data/mockAnalytics';
import { CurrencyDollarIcon } from '../components/icons/CurrencyDollarIcon';
import { UsersGroupIcon } from '../components/icons/UsersGroupIcon';
import { ArrowTrendingUpIcon } from '../components/icons/ArrowTrendingUpIcon';
import Badge from '../components/Badge';

const iconMap: { [key: string]: React.ReactNode } = {
    'Revenue': <CurrencyDollarIcon />,
    'Clients': <UsersGroupIcon />,
    'Conversion': <ArrowTrendingUpIcon />,
};

const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral', icon: React.ReactNode }> = ({ title, value, change, changeType, icon }) => {
    const changeColor = changeType === 'increase' ? 'text-green-400' : changeType === 'decrease' ? 'text-red-400' : 'text-slate-400';
    return (
        <div className="relative bg-gradient-to-br from-light-bg to-panel-bg p-6 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold text-white mt-1">{value}</p>
                    <p className={`text-xs mt-2 ${changeColor}`}>
                        {change}
                    </p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20">
                    {icon}
                </div>
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { month: string, revenue: number }[] }> = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue));
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

const AnalyticsPage: React.FC = () => {
  return (
    <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">تحليلات وتقارير</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {kpiData.map(kpi => (
                    <StatCard 
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.value}
                        change={kpi.change}
                        changeType={kpi.changeType}
                        icon={iconMap[kpi.icon]}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2">
                    <BarChart data={monthlyRevenue} />
                </div>
                
                {/* Recent Signups */}
                <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">أحدث العملاء</h3>
                    <ul className="space-y-4">
                        {recentSignups.map(client => (
                             <li key={client.id} className="flex items-center gap-3">
                                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold rounded-full">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-200">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.joinDate}</p>
                                </div>
                             </li>
                        ))}
                    </ul>
                </div>

                {/* Campaign Performance Table */}
                <div className="lg:col-span-3 bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">أداء الحملات</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="text-slate-400">
                                <tr>
                                    <th className="p-2 font-semibold">الحملة</th>
                                    <th className="p-2 font-semibold">المنصة</th>
                                    <th className="p-2 font-semibold">الإنفاق</th>
                                    <th className="p-2 font-semibold">النتائج (التحويلات)</th>
                                    <th className="p-2 font-semibold">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {campaignPerformance.map(campaign => (
                                    <tr key={campaign.id}>
                                        <td className="p-2 text-white font-medium">{campaign.name}</td>
                                        <td className="p-2 text-slate-300">{campaign.platform}</td>
                                        <td className="p-2 text-slate-300">{campaign.spend.toLocaleString()} ج.م</td>
                                        <td className="p-2 text-slate-300">{campaign.conversions}</td>
                                        <td className="p-2"><Badge color={campaign.status === 'نشطة' ? 'green' : 'gray'}>{campaign.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

export default AnalyticsPage;
