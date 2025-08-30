
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
    items: { description: string; amount: number }[]; // UI-only field for calculation
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

// ---- Status Mapping Helpers ----
const projectStatusFromDb = (dbStatus: string | null): ClientProject['status'] => {
    switch (dbStatus) {
        case 'pending':
        case 'in_progress':
            return 'قيد التنفيذ';
        case 'completed':
            return 'مكتمل';
        case 'on_hold':
        case 'paused':
        case 'cancelled':
            return 'متوقف';
        default:
            return 'قيد التنفيذ';
    }
};

const projectStatusToDb = (appStatus: ClientProject['status']): string => {
    switch (appStatus) {
        case 'قيد التنفيذ':
            return 'pending';
        case 'مكتمل':
            return 'completed';
        case 'متوقف':
            return 'paused';
        default:
            return 'pending';
    }
};


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
    
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    
    // Map DB schema to app's `ClientProject` type
    return data.map(p => ({
        id: p.id,
        clientPhone,
        name: p.notes || `مشروع #${p.id}`,
        status: projectStatusFromDb(p.status),
        startDate: new Date(p.created_at).toISOString().split('T')[0],
        dueDate: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : '', // Placeholder
    }));
};

export const addProject = async (project: ClientProject): Promise<void> => {
    const userId = await getUserIdByPhone(project.clientPhone);
    if (!userId) throw new Error("Client not found");
    
    // Dynamically fetch a valid service_id to prevent foreign key errors
    const { data: services, error: serviceError } = await supabase.from('services').select('id').limit(1);
    if (serviceError || !services || services.length === 0) {
        throw new Error('No services available to associate with the project.');
    }
    const serviceId = services[0].id;

    const { error } = await supabase.from('orders').insert({
        user_id: userId,
        service_id: serviceId,
        notes: project.name,
        status: projectStatusToDb(project.status),
        // Let the DB handle id and created_at
    });
    if (error) {
        console.error("Error adding project:", error);
        throw new Error('Failed to add project.');
    }
};

export const updateProject = async (project: ClientProject): Promise<void> => {
     const { error } = await supabase.from('orders').update({
        notes: project.name,
        status: projectStatusToDb(project.status)
    }).eq('id', project.id);
    if (error) throw new Error('Failed to update project.');
};


// --- Invoices Management ---

export const getInvoicesByClient = async (clientPhone: string): Promise<ClientInvoice[]> => {
    const userId = await getUserIdByPhone(clientPhone);
    if (!userId) return [];

    const { data, error } = await supabase.from('invoices').select('*').eq('user_id', userId).order('issue_date', { ascending: false });
    if (error) return [];
    
    return data.map(i => ({
        id: i.id,
        clientPhone,
        issueDate: new Date(i.issue_date).toISOString().split('T')[0],
        amount: i.amount,
        status: i.status === 'unpaid' ? 'غير مدفوعة' : 'مدفوعة',
        items: i.items || [{ description: 'فاتورة', amount: i.amount }]
    }));
};

export const addInvoice = async (invoice: ClientInvoice): Promise<void> => {
    const userId = await getUserIdByPhone(invoice.clientPhone);
    if (!userId) throw new Error("Client not found");

    const { error } = await supabase.from('invoices').insert({
        user_id: userId,
        amount: invoice.amount,
        status: invoice.status === 'مدفوعة' ? 'paid' : 'unpaid',
        issue_date: invoice.issueDate,
        // The `items` column doesn't exist in the provided schema. Only total amount is saved.
    });
    if (error) {
        console.error("Error adding invoice:", error);
        throw new Error('Failed to add invoice.');
    }
};

export const updateInvoice = async (invoice: ClientInvoice): Promise<void> => {
     const { error } = await supabase.from('invoices').update({
        amount: invoice.amount,
        status: invoice.status === 'مدفوعة' ? 'paid' : 'unpaid',
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
