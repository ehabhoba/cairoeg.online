
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getNotifications, markNotificationsAsRead, Notification } from '../data/notificationsData';
import { BellIcon } from './icons/BellIcon';

interface NotificationBellProps {
    userPhone: string;
    userRole: 'admin' | 'client';
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userPhone, userRole }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const recipient = userRole === 'admin' ? 'admin' : userPhone;

    const fetchNotifications = useCallback(async () => {
        const userNotifications = await getNotifications(recipient);
        setNotifications(userNotifications);
    }, [recipient]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll for new notifications every 10 seconds
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = async () => {
        setIsOpen(prev => !prev);
        if (!isOpen && unreadCount > 0) {
            await markNotificationsAsRead(recipient);
            fetchNotifications(); // Re-fetch to update the read status visually
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleToggle} className="relative p-2 text-slate-300 hover:text-white transition-colors">
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-light-bg rounded-lg shadow-lg border border-slate-700 z-50 animate-fade-in">
                    <div className="p-3 font-bold text-white border-b border-slate-700">الإشعارات</div>
                    <ul className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <li key={n.id} className={`p-3 border-b border-slate-700/50 ${!n.isRead ? 'bg-primary/10' : ''}`}>
                                    <p className="text-sm text-slate-200">{n.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(n.timestamp).toLocaleString('ar-EG')}</p>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-center text-slate-400">لا توجد إشعارات.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
