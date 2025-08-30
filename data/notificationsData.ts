
export interface Notification {
    id: number;
    recipient: 'admin' | string; // 'admin' or client's phone number
    message: string;
    timestamp: string;
    isRead: boolean;
}

const NOTIFICATIONS_DB_KEY = 'cairoeg-notifications';

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const initializeNotifications = (): void => {
    if (!localStorage.getItem(NOTIFICATIONS_DB_KEY)) {
        localStorage.setItem(NOTIFICATIONS_DB_KEY, JSON.stringify([]));
    }
};

const getAllNotifications = async (): Promise<Notification[]> => {
    await simulateDelay(50);
    const notificationsJson = localStorage.getItem(NOTIFICATIONS_DB_KEY);
    return notificationsJson ? JSON.parse(notificationsJson) : [];
};

const saveNotifications = async (notifications: Notification[]): Promise<void> => {
    await simulateDelay(50);
    localStorage.setItem(NOTIFICATIONS_DB_KEY, JSON.stringify(notifications));
};

export const getNotifications = async (recipient: 'admin' | string): Promise<Notification[]> => {
    const all = await getAllNotifications();
    const userNotifications = all.filter(n => n.recipient === recipient);
    return userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Promise<void> => {
    const notifications = await getAllNotifications();
    const newNotification: Notification = {
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false
    };
    notifications.unshift(newNotification);
    await saveNotifications(notifications);
};

export const markNotificationsAsRead = async (recipient: 'admin' | string): Promise<void> => {
    let notifications = await getAllNotifications();
    notifications = notifications.map(n => n.recipient === recipient ? { ...n, isRead: true } : n);
    await saveNotifications(notifications);
};
