
import { supabase } from '../services/supabaseClient';

export interface InvoiceDetail {
    id: string;
    client_name: string;
    amount: number;
    status: string;
    issue_date: string;
}

export interface FinancialData {
    totalRevenue: number;
    unpaidAmount: number;
    invoiceCount: number;
    invoices: InvoiceDetail[];
}

export const getFinancials = async (): Promise<FinancialData> => {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            id,
            amount,
            status,
            issue_date,
            users ( name )
        `)
        .order('issue_date', { ascending: false });

    if (error) {
        console.error("Error fetching financial data:", error);
        return { totalRevenue: 0, unpaidAmount: 0, invoiceCount: 0, invoices: [] };
    }

    const financials = data.reduce((acc, inv) => {
        if (inv.status === 'paid') {
            acc.totalRevenue += inv.amount;
        } else {
            acc.unpaidAmount += inv.amount;
        }
        acc.invoiceCount += 1;
        return acc;
    }, { totalRevenue: 0, unpaidAmount: 0, invoiceCount: 0 });
    
    const invoices = data.map(inv => ({
        id: inv.id,
        // @ts-ignore
        client_name: inv.users?.name || 'عميل غير محدد',
        amount: inv.amount,
        status: inv.status,
        issue_date: inv.issue_date,
    }));

    return { ...financials, invoices };
};
