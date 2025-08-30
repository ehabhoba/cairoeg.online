import React, { useState, useEffect } from 'react';
import { getKpiData, getMonthlyRevenue, KpiData, MonthlyRevenue } from '../data/analyticsData';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CurrencyDollarIcon } from '../components/icons/CurrencyDollarIcon';
import { UsersGroupIcon } from '../components/icons/UsersGroupIcon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => {
    return (
        <div className="relative bg-light-bg p-6 rounded-2xl border border-slate-700/50 shadow-lg">
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
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    return (
        <div className="bg-panel-bg p-6 rounded-2xl border border-slate-100/10 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-4">الإيرادات الشهرية</h3>
            <div className="flex items-end justify-between gap-2 h-64 pt-4">
                {data.map(({ month, revenue }) => (
                    <div key={month} className="relative flex flex-col items-center flex-1 h-full group">
                         <div className="absolute -top-8 bg-dark-bg text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {revenue.toLocaleString()} ج.م
                        </div>
                        <div
                            className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-opacity duration-300 opacity-75 group-hover:opacity-100"
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
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [kpis, revenue] = await Promise.all([
                getKpiData(),
                getMonthlyRevenue(),
            ]);
            setKpiData(kpis);
            setMonthlyRevenue(revenue);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="flex-1 bg-dark-bg p-6 flex items-center justify-center">
                <LoadingSpinner />
            </main>
        );
    }
    
    return (
        <main className="flex-1 bg-dark-bg p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">تحليلات الأداء</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <StatCard 
                        title="إجمالي الإيرادات المدفوعة"
                        value={`${kpiData?.totalRevenue.toLocaleString() || 0} ج.م`}
                        icon={<CurrencyDollarIcon />}
                    />
                    <StatCard 
                        title="إجمالي العملاء"
                        value={kpiData?.clientCount.toString() || '0'}
                        icon={<UsersGroupIcon />}
                    />
                </div>
                
                <div className="mt-6">
                    <BarChart data={monthlyRevenue} />
                </div>
            </div>
        </main>
    );
};

export default AnalyticsPage;
