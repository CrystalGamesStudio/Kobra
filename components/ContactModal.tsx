import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface ContactModalProps {
    onClose: () => void;
}

const CopyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CheckmarkIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" fill="currentColor"/>
    </svg>
);

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
    const { t } = useSettings();
    const email = "crystalgamesstudio9@gmail.com";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--panel-bg)] w-full max-w-lg rounded-2xl shadow-xl border border-[var(--border-color)] animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">{t.contact_title}</h2>
                     <button onClick={onClose} className="h-12 w-12 bg-transparent hover:bg-[var(--border-color)] active:scale-95 text-[var(--text-color)] flex items-center justify-center rounded-lg transition-colors" aria-label={t.create_project_close_aria}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-8 text-[var(--text-color)]">
                    <div className="flex items-center space-x-4 bg-[var(--bg-color)] p-4 rounded-lg border border-[var(--border-color)]">
                        <span className="text-[var(--accent-color)] font-mono flex-grow break-all">{email}</span>
                        <button
                            onClick={handleCopy}
                            className="bg-[var(--panel-bg)] hover:bg-[var(--border-color)] border border-[var(--border-color)] active:scale-95 text-[var(--text-color)] font-semibold py-3 px-5 rounded-lg flex-shrink-0 w-14 h-14 flex items-center justify-center transition-all duration-300"
                        >
                            <div className="relative w-6 h-6">
                                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'}`}>
                                    <CopyIcon />
                                </div>
                                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 text-[var(--accent-color)] ${copied ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'}`}>
                                    <CheckmarkIcon />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
