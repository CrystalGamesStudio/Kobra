import React, { useEffect } from 'react';

interface NotificationAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

interface NotificationProps {
    message: string;
    type?: 'info' | 'warning' | 'success' | 'error';
    onClose: () => void;
    duration?: number;
    actions?: NotificationAction[];
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onClose, duration, actions }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeStyles = {
        info: 'bg-blue-500 border-blue-600 text-white',
        warning: 'bg-yellow-500 border-yellow-600 text-white',
        success: 'bg-green-500 border-green-600 text-white',
        error: 'bg-red-500 border-red-600 text-white',
    };

    return (
        <div className={`${typeStyles[type]} border-2 rounded-lg p-4 shadow-lg animate-fade-in-up min-w-[320px] max-w-md`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-sm font-medium flex-1 text-white">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                    aria-label="Close notification"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {actions && actions.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/30">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                action.onClick();
                                onClose();
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                                action.variant === 'primary'
                                    ? 'bg-white text-red-500 hover:bg-gray-100'
                                    : 'bg-transparent border border-white/50 text-white hover:bg-white/20'
                            }`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notification;

