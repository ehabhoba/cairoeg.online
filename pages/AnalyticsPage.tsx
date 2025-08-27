
import React from 'react';
import { kpiData, monthlyRevenue, recentActivities } from '../data/mockAnalytics';
import { CurrencyDollarIcon } from '../components/icons/CurrencyDollarIcon';
import { UsersGroupIcon } from '../components/icons/UsersGroupIcon';
import { ArrowTrendingUpIcon } from '../components/icons/ArrowTrendingUpIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { SpeakerphoneIcon } from '../components/icons/SpeakerphoneIcon';

const iconMap: { [key: string]: React.ReactNode } = {
    'Revenue': <CurrencyDollarIcon />,
    'Clients': <UsersGroupIcon />,
    'Conversion': <ArrowTrendingUpIcon />,
    'Campaign': <SpeakerphoneIcon />,
    'Task': <CheckCircleIcon />,
};

const StatCard: React.FC<{ title: string; value: string; change: string; changeType: 'increase' | 'decrease' | 'neutral', icon: React.ReactNode }> = ({ title, value, change, changeType, icon }) => {
    const changeColor = changeType === 'increase' ? 'text-green-500' : changeType === 'decrease' ? 'text-red-500' : 'text-slate-500';
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
                <p className={`text-xs mt-2 ${changeColor}`}>
                    {change}
                </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg">
                {icon}
            </div>
        </div>
    );
};

const BarChart: React.FC<{ data: { month: string, revenue: number }[] }> = ({ data }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">نظرة عامة على الإيرادات الشهرية</h3>
            <div className="flex items-end justify-between gap-2 h-64">
                {data.map(({ month, revenue }) => (
                    <div key={month} className="flex flex-col items-center flex-1 h-full">
                        <div className="w-full h-full flex items-end">
                            <div
                                className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors"
                                style={{ height: `${(revenue / maxRevenue) * 100}%` }}
                                title={`Revenue: ${revenue.toLocaleString()}`}
                            ></div>
                        </div>
                        <span className="text-xs text-slate-500 mt-2">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AnalyticsPage: React.FC = () => {
  return (
    <main className="flex-1 bg-slate-50 p-4 lg:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">تحليلات وتقارير</h1>
            
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
                
                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">أحدث الأنشطة</h3>
                    <ul className="space-y-4">
                        {recentActivities.map(activity => (
                             <li key={activity.id} className="flex items-start gap-3">
                                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full">
                                    {iconMap[activity.icon]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{activity.description}</p>
                                    <p className="text-xs text-slate-500">{activity.timestamp}</p>
                                </div>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </main>
  );
};

export default AnalyticsPage;