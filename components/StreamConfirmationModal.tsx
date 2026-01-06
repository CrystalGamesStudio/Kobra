import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface StreamConfirmationModalProps {
    onStartLive: () => void;
    onPrepare: () => void;
}

const StreamConfirmationModal: React.FC<StreamConfirmationModalProps> = ({ onStartLive, onPrepare }) => {
    const { t } = useSettings();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[var(--panel-bg)] w-full max-w-lg text-center p-10 rounded-2xl shadow-xl border border-[var(--border-color)] animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold text-[var(--text-color)] mb-2">{t.stream_confirm_title}</h2>
                <p className="text-[var(--text-color-light)] mb-8">{t.stream_confirm_subtitle}</p>
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={onPrepare}
                        className="bg-transparent hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-color)] font-bold py-4 px-10 rounded-lg active:scale-95 text-lg transition-colors"
                    >
                        {t.stream_confirm_prepare}
                    </button>
                    <button 
                        onClick={onStartLive}
                        className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-bold py-4 px-10 rounded-lg active:scale-95 text-lg transition-colors"
                    >
                        {t.stream_confirm_start}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StreamConfirmationModal;