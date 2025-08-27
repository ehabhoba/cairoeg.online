
import React, { useState, useEffect } from 'react';
import { type Notification as NotificationType } from '../providers/NotificationProvider';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ErrorIcon } from './icons/ErrorIcon';
import { InfoIcon } from './icons/InfoIcon';
import { XIcon } from './icons/XIcon';

interface NotificationProps {
  notification: NotificationType;
  onDismiss: (id: number) => void;
}

const iconMap = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  error: <ErrorIcon className="w-6 h-6 text-red-500" />,
  info: <InfoIcon className="w-6 h-6 text-blue-500" />,
};

const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.duration) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = notification.duration! - elapsedTime;
        setProgress((remainingTime / notification.duration!) * 100);

        if (remainingTime <= 0) {
          clearInterval(timer);
          handleDismiss();
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [notification.duration]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Match animation duration
  };

  const animationClass = exiting ? 'animate-slide-out' : 'animate-slide-in';
  const icon = iconMap[notification.type];

  return (
    <div
      className={`relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-lg pointer-events-auto overflow-hidden border dark:border-slate-700 ${animationClass}`}
      style={{
        '--slide-in-transform': 'translateX(100%)',
        '--slide-out-transform': 'translateX(100%)',
      } as React.CSSProperties}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">{icon}</div>
        <div className="mr-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
          {notification.message && <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{notification.message}</p>}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={handleDismiss}
            className="inline-flex text-gray-400 dark:text-slate-500 rounded-md hover:text-gray-500 dark:hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {notification.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700">
          <div
            className="h-full bg-primary transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: var(--slide-in-transform); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }

        @keyframes slide-out {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: var(--slide-out-transform); }
        }
        .animate-slide-out { animation: slide-out 0.3s ease-in forwards; }
      `}</style>
    </div>
  );
};

export default Notification;
