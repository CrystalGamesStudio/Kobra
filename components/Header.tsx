import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { User } from '../services/authService';

// --- ICONS ---
const EndStreamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 9-6 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 6 6" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12" />
    </svg>
);
const GoLiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
    </svg>
);
const RecordingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" fill="currentColor" className="text-red-500"/>
    </svg>
)

interface HeaderProps {
    user: User;
    onEndStream: () => void;
    onGoLive: () => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onSettingsClick: () => void;
    onLogout: () => void;
    isStreaming: boolean;
    isLive: boolean;
    isRecording: boolean;
}

const HeaderButton: React.FC<{onClick?: () => void, children: React.ReactNode, className?: string, ariaLabel?: string}> = ({ onClick, children, className = '', ariaLabel }) => (
    <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`bg-transparent hover:bg-[var(--border-color)] h-12 w-12 flex items-center justify-center text-[var(--text-color)] rounded-lg active:scale-95 transition-colors ${className}`}
    >
        {children}
    </button>
);


const Header: React.FC<HeaderProps> = ({ user, onEndStream, onGoLive, onStartRecording, onStopRecording, onSettingsClick, onLogout, isStreaming, isLive, isRecording }) => {
    const { t } = useSettings();


    return (
        <header className="flex-shrink-0 bg-[var(--panel-bg)] rounded-xl shadow-sm border border-[var(--border-color)]">
            <div className="flex items-center justify-end h-16 px-4 sm:px-6">
                <div className="flex items-center space-x-2">
                    {isStreaming && (
                        <>
                            {isLive ? (
                                <>
                                    <button 
                                        onClick={onEndStream}
                                        className="bg-red-500/20 text-red-500 hover:bg-red-500/30 active:scale-95 font-bold py-2.5 px-5 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                                    >
                                        <EndStreamIcon />
                                        <span>{t.header_end_stream}</span>
                                    </button>
                                     {isRecording ? (
                                        <button 
                                            onClick={onStopRecording}
                                            className="bg-red-500 text-white hover:bg-red-600 active:scale-95 font-bold py-2.5 px-5 rounded-lg text-sm flex items-center space-x-2 transition-colors animate-pulse"
                                        >
                                            <RecordingIcon />
                                            <span>{t.header_stop_recording}</span>
                                        </button>
                                     ) : (
                                        <button 
                                            onClick={onStartRecording}
                                            className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white active:scale-95 font-bold py-2.5 px-5 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                                        >
                                            <RecordingIcon />
                                            <span>{t.header_start_recording}</span>
                                        </button>
                                     )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={onEndStream}
                                        className="bg-[var(--panel-bg)] hover:bg-[var(--border-color)] border border-[var(--border-color)] active:scale-95 font-bold py-2.5 px-5 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                                    >
                                        <CloseIcon />
                                        <span>{t.header_close}</span>
                                    </button>
                                   <button 
                                        onClick={onGoLive}
                                        className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white active:scale-95 font-bold py-2.5 px-5 rounded-lg text-sm flex items-center space-x-2 animate-pulse transition-colors"
                                    >
                                         <GoLiveIcon />
                                        <span>{t.header_go_live}</span>
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;