import { supabase } from '../services/supabaseClient';
import { findAdmin, findUserByPhone } from './userData';

export interface Notification {
    id: number;
    recipient: 'admin' | string; // 'admin' or client's phone number
    message: string;
    timestamp: string;
    isRead: boolean;
}

export const getNotifications = async (recipient: 'admin' | string): Promise<Notification[]> => {
    let userId: string | undefined;
    if (recipient === 'admin') {
        const admin = await findAdmin();
        userId = admin?.id;
    } else {
        const user = await findUserByPhone(recipient);
        userId = user?.id;
    }

    if (!userId) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }

    return data.map(n => ({
        id: n.id,
        recipient,
        message: n.message,
        timestamp: n.created_at,
        isRead: n.is_read,
    }));
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): Promise<void> => {
    let userId: string | undefined;
    if (notification.recipient === 'admin') {
        const admin = await findAdmin();
        userId = admin?.id;
    } else {
        const user = await findUserByPhone(notification.recipient);
        userId = user?.id;
    }

    if (!userId) {
        console.error("Recipient not found for notification:", notification.recipient);
        return;
    }

    const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        message: notification.message,
        is_read: false,
    });
    if (error) console.error("Error adding notification:", error);
};

export const markNotificationsAsRead = async (recipient: 'admin' | string): Promise<void> => {
    let userId: string | undefined;
    if (recipient === 'admin') {
        const admin = await findAdmin();
        userId = admin?.id;
    } else {
        const user = await findUserByPhone(recipient);
        userId = user?.id;
    }

    if (!userId) return;

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false); // Only update unread ones

    if (error) console.error("Error marking notifications as read:", error);
};
