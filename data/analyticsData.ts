import { supabase } from '../services/supabaseClient';

export interface KpiData {
    totalRevenue: number;
    clientCount: number;
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export const getKpiData = async (): Promise<KpiData> => {
    try {
        const { data: revenueData, error: revenueError } = await supabase
            .from('invoices')
            .select('amount')
            .eq('status', 'paid');
        
        if (revenueError) throw revenueError;

        const { count: clientCount, error: clientError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'client');
        
        if (clientError) throw clientError;

        const totalRevenue = revenueData?.reduce((sum, inv) => sum + inv.amount, 0) || 0;

        return { totalRevenue, clientCount: clientCount || 0 };
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        return { totalRevenue: 0, clientCount: 0 };
    }
};

export const getMonthlyRevenue = async (): Promise<MonthlyRevenue[]> => {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select('issue_date, amount')
            .eq('status', 'paid');
        
        if (error || !data) throw error || new Error("No data");
        
        const revenueByMonth: { [key: string]: number } = {};
        const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

        // Initialize last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = monthNames[d.getMonth()];
            revenueByMonth[monthName] = 0;
        }

        data.forEach(invoice => {
            const date = new Date(invoice.issue_date);
            const month = monthNames[date.getMonth()];
            if (month in revenueByMonth) {
                revenueByMonth[month] = (revenueByMonth[month] || 0) + invoice.amount;
            }
        });

        return Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));

    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        return [];
    }
};
