import { supabase } from '../services/supabaseClient';

// These types align with the app's needs.
// They will be populated from the Supabase schema.

export interface ClientProject {
    id: string; // Corresponds to `orders.id`
    clientPhone: string;
    name: string; // Corresponds to `orders.notes` or similar
    status: 'قيد التنفيذ' | 'مكتمل' | 'متوقف'; // Corresponds to `orders.status`
    startDate: string; // Corresponds to `orders.created_at`
    dueDate: string; // A new field or from `orders` table if available
}

export interface ClientInvoice {
    id: string; // Corresponds to `invoices.id`
    clientPhone: string;
    issueDate: string; // `invoices.issue_date`
    amount: number; // `invoices.amount`
    status: 'مدفوعة' | 'غير مدفوعة'; // `invoices.status`
    items: { description: string; amount: number }[]; // Stored in a custom `items` jsonb column
}

export interface ProjectFile {
    id: number;
    order_id: string;
    file_name: string;
    file_url: string;
    uploaded_at: string;
}

export interface Campaign {
    id: number;
    order_id: string;
    platform: string;
    budget: number;
    status: 'draft' | 'active' | 'completed';
}


// --- User ID Helper ---
const getUserIdByPhone = async (phone: string): Promise<string | null> => {
    const { data, error } = await supabase.from('users').select('id').eq('phone_number', phone).single();
    if (error || !data) {
        console.error('Error fetching user ID for phone:', phone, error);
        return null;
    }
    return data.id;
};

// --- Projects (Orders) Management ---

export const getProjectsByClient = async (clientPhone: string): Promise<ClientProject[]> => {
    const userId = await getUserIdByPhone(clientPhone);
    if (!userId) return [];
    
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId);
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    
    // Map DB schema to app's `ClientProject` type
    return data.map(p => ({
        id: p.id,
        clientPhone,
        name: p.notes || `مشروع #${p.id}`,
        status: p.status === 'pending' ? 'قيد التنفيذ' : p.status === 'completed' ? 'مكتمل' : 'متوقف',
        startDate: new Date(p.created_at).toISOString().split('T')[0],
        dueDate: new Date(p.updated_at).toISOString().split('T')[0], // Placeholder
    }));
};

export const addProject = async (project: ClientProject): Promise<void> => {
    const userId = await getUserIdByPhone(project.clientPhone);
    if (!userId) throw new Error("Client not found");

    const { error } = await supabase.from('orders').insert({
        id: project.id,
        user_id: userId,
        service_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Placeholder service_id
        notes: project.name,
        status: project.status,
        created_at: project.startDate
    });
    if (error) throw new Error('Failed to add project.');
};

export const updateProject = async (project: ClientProject): Promise<void> => {
     const { error } = await supabase.from('orders').update({
        notes: project.name,
        status: project.status
    }).eq('id', project.id);
    if (error) throw new Error('Failed to update project.');
};


// --- Invoices Management ---

export const getInvoicesByClient = async (clientPhone: string): Promise<ClientInvoice[]> => {
    const userId = await getUserIdByPhone(clientPhone);
    if (!userId) return [];

    const { data, error } = await supabase.from('invoices').select('*').eq('user_id', userId);
    if (error) return [];
    
    return data.map(i => ({
        id: i.id,
        clientPhone,
        issueDate: new Date(i.issue_date).toISOString().split('T')[0],
        amount: i.amount,
        status: i.status === 'unpaid' ? 'غير مدفوعة' : 'مدفوعة',
        items: i.items || [{ description: 'فاتورة', amount: i.amount }] // Assumes an `items` jsonb column
    }));
};

export const addInvoice = async (invoice: ClientInvoice): Promise<void> => {
    const userId = await getUserIdByPhone(invoice.clientPhone);
    if (!userId) throw new Error("Client not found");

    const { error } = await supabase.from('invoices').insert({
        id: invoice.id,
        user_id: userId,
        amount: invoice.amount,
        status: invoice.status === 'مدفوعة' ? 'paid' : 'unpaid',
        issue_date: invoice.issueDate,
        items: invoice.items,
    });
    if (error) throw new Error('Failed to add invoice.');
};

export const updateInvoice = async (invoice: ClientInvoice): Promise<void> => {
     const { error } = await supabase.from('invoices').update({
        amount: invoice.amount,
        status: invoice.status === 'مدفوعة' ? 'paid' : 'unpaid',
        items: invoice.items,
    }).eq('id', invoice.id);
    if (error) throw new Error('Failed to update invoice.');
};

// --- Files & Campaigns for Dashboard ---

export const getFilesByClient = async (clientPhone: string): Promise<ProjectFile[]> => {
    const projects = await getProjectsByClient(clientPhone);
    if (projects.length === 0) return [];
    const projectIds = projects.map(p => p.id);

    const { data, error } = await supabase.from('project_files').select('*').in('order_id', projectIds);
    return error ? [] : data;
};

export const getCampaignsByClient = async (clientPhone: string): Promise<Campaign[]> => {
    const projects = await getProjectsByClient(clientPhone);
    if (projects.length === 0) return [];
    const projectIds = projects.map(p => p.id);
    
    const { data, error } = await supabase.from('campaigns').select('*').in('order_id', projectIds);
    return error ? [] : data;
};
