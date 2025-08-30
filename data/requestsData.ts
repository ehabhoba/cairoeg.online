
import { addNotification } from './notificationsData';

export type RequestType = 'campaign' | 'design';
export type RequestStatus = 'قيد المراجعة' | 'قيد التنفيذ' | 'مكتمل' | 'ملغي';

export interface ClientRequest {
    id: number;
    clientPhone: string;
    type: RequestType;
    status: RequestStatus;
    timestamp: string;
    details: {
        [key: string]: any;
    };
}

const REQUESTS_DB_KEY = 'cairoeg-requests';

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const initializeRequests = (): void => {
    if (!localStorage.getItem(REQUESTS_DB_KEY)) {
        localStorage.setItem(REQUESTS_DB_KEY, JSON.stringify([]));
    }
};

const getRequests = async (): Promise<ClientRequest[]> => {
    await simulateDelay(100);
    const requestsJson = localStorage.getItem(REQUESTS_DB_KEY);
    return requestsJson ? JSON.parse(requestsJson) : [];
};

const saveRequests = async (requests: ClientRequest[]): Promise<void> => {
    await simulateDelay(100);
    localStorage.setItem(REQUESTS_DB_KEY, JSON.stringify(requests));
};

export const getAllRequests = async (): Promise<ClientRequest[]> => {
    return await getRequests();
};

export const getRequestsByClient = async (clientPhone: string): Promise<ClientRequest[]> => {
    const allRequests = await getRequests();
    return allRequests.filter(r => r.clientPhone === clientPhone);
};

export const addRequest = async (request: Omit<ClientRequest, 'id' | 'timestamp' | 'status'>): Promise<void> => {
    const requests = await getRequests();
    const newRequest: ClientRequest = {
        ...request,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'قيد المراجعة'
    };
    requests.unshift(newRequest);
    await saveRequests(requests);

    // Notify admin
    await addNotification({
        recipient: 'admin',
        message: `طلب جديد من العميل ${request.clientPhone}: ${request.details.title}`
    });
};

export const updateRequestStatus = async (id: number, status: RequestStatus, clientPhone: string): Promise<void> => {
    let requests = await getRequests();
    requests = requests.map(r => r.id === id ? { ...r, status } : r);
    await saveRequests(requests);

    // Notify client
    await addNotification({
        recipient: clientPhone,
        message: `تم تحديث حالة طلبك #${id} إلى: ${status}`
    });
};
