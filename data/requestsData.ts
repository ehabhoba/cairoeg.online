import { supabase } from '../services/supabaseClient';
import { addNotification } from './notificationsData';
import { findUserByPhone, findUserById } from './userData';

export type RequestType = 'campaign' | 'design';
export type RequestStatus = 'قيد المراجعة' | 'قيد التنفيذ' | 'مكتمل' | 'ملغي';

export interface ClientRequest {
    id: number; // ticket.id
    clientPhone: string;
    type: RequestType;
    status: RequestStatus;
    timestamp: string; // ticket.created_at
    details: {
        title: string;
        [key: string]: any;
    };
}

const statusMapToDB: { [key in RequestStatus]: string } = {
    'قيد المراجعة': 'open',
    'قيد التنفيذ': 'in_progress',
    'مكتمل': 'closed',
    'ملغي': 'cancelled',
};

const statusMapFromDB = (dbStatus: string): RequestStatus => {
    switch (dbStatus) {
        case 'in_progress': return 'قيد التنفيذ';
        case 'closed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
        case 'open':
        default:
            return 'قيد المراجعة';
    }
};

const parseRequestFromSupabase = (ticket: any): ClientRequest => {
    // FIX: Add a more specific type to `details` to include the optional `type` property.
    let details: { title: string; type?: RequestType; [key: string]: any } = { title: ticket.subject };
    try {
        const parsedDesc = JSON.parse(ticket.description);
        details = { ...details, ...parsedDesc };
    } catch (e) {
        // Not a JSON description, just use subject
    }
    return {
        id: ticket.id,
        clientPhone: ticket.users?.phone_number || 'N/A',
        type: details.type || 'campaign', // Infer type from details or default
        status: statusMapFromDB(ticket.status),
        timestamp: ticket.created_at,
        details,
    };
};

export const getAllRequests = async (): Promise<ClientRequest[]> => {
    const { data, error } = await supabase
        .from('tickets')
        .select('*, users (phone_number)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching requests:', error);
        return [];
    }
    return data.map(parseRequestFromSupabase);
};

export const getRequestsByClient = async (clientPhone: string): Promise<ClientRequest[]> => {
    const user = await findUserByPhone(clientPhone);
    if (!user || !user.id) return [];

    const { data, error } = await supabase
        .from('tickets')
        .select('*, users!inner(phone_number)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching client requests:', error);
        return [];
    }
    return data.map(parseRequestFromSupabase);
};

export const addRequest = async (request: Omit<ClientRequest, 'id' | 'timestamp' | 'status'>): Promise<void> => {
    const user = await findUserByPhone(request.clientPhone);
    if (!user || !user.id) throw new Error("User not found");

    const newTicket = {
        user_id: user.id,
        subject: request.details.title,
        description: JSON.stringify(request.details),
        status: 'open',
        priority: 'low',
    };
    
    const { error } = await supabase.from('tickets').insert(newTicket);
    if (error) {
        console.error('Error adding request:', error);
        throw new Error("Failed to add new request.");
    }

    // Notify admin
    await addNotification({
        recipient: 'admin',
        message: `طلب جديد من العميل ${request.clientPhone}: ${request.details.title}`
    });
};

export const updateRequestStatus = async (id: number, status: RequestStatus, clientPhone: string): Promise<void> => {
    const dbStatus = statusMapToDB[status];
    const { error } = await supabase
        .from('tickets')
        .update({ status: dbStatus })
        .eq('id', id);

    if (error) {
        console.error('Error updating request status:', error);
        throw new Error("Failed to update request status.");
    }

    // Notify client
    await addNotification({
        recipient: clientPhone,
        message: `تم تحديث حالة طلبك #${id} إلى: ${status}`
    });
};