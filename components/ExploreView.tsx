import React, { useState, useEffect } from 'react';
import { Recording } from '../types';
import { getPublicRecordings } from '../services/recordingService';
import { useSettings } from '../contexts/SettingsContext';
import RecordingCard from './RecordingCard';

const ExploreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-[var(--text-color-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;

const ExploreView: React.FC = () => {
    const { t } = useSettings();
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = getPublicRecordings((fetchedRecordings) => {
            setRecordings(fetchedRecordings);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in text-[var(--text-color)]">
             <div className="p-4 sm:p-6 md:p-10 rounded-xl bg-[var(--accent-color)] text-white animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{t.explore_title}</h1>
                <p className="mt-2 text-sm sm:text-base md:text-lg opacity-90">{t.explore_subtitle}</p>
            </div>
            
            {isLoading ? (
                 <div className="text-center py-10 sm:py-16 md:py-20">
                    <div className="inline-loader" style={{ width: '40px', height: '40px' }}></div>
                </div>
            ) : recordings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {recordings.map(rec => <RecordingCard key={rec.id} recording={rec} />)}
                </div>
            ) : (
                <div className="text-center py-10 sm:py-16 md:py-20 px-4 sm:px-6 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl">
                    <ExploreIcon />
                    <h3 className="mt-4 text-lg sm:text-xl font-medium">{t.explore_empty_title}</h3>
                    <p className="mt-1 text-sm sm:text-base text-[var(--text-color-light)]">{t.explore_empty_subtitle}</p>
                </div>
            )}
        </div>
    );
};

export default ExploreView;
