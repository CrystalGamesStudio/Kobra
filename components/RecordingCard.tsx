import React from 'react';
import { Recording } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface RecordingCardProps {
    recording: Recording;
}

const RecordingCard: React.FC<RecordingCardProps> = ({ recording }) => {
    const { language } = useSettings();
    const formattedDate = new Date(recording.createdAt).toLocaleDateString(language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const formattedDuration = new Date(recording.duration * 1000).toISOString().substr(11, 8);

    return (
        <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="relative aspect-video bg-[var(--bg-color)]">
                <video controls preload="metadata" className="w-full h-full object-cover">
                    <source src={recording.videoUrl} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
                 <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded">
                    {formattedDuration}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg truncate text-[var(--text-color)]" title={recording.projectName}>{recording.projectName}</h3>
                <div className="flex items-center mt-2">
                    <img src={recording.userPhotoURL} alt={recording.userDisplayName} className="w-8 h-8 rounded-full mr-3"/>
                    <div className="text-sm">
                        <p className="text-[var(--text-color)] font-semibold truncate">{recording.userDisplayName}</p>
                        <p className="text-[var(--text-color-light)]">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordingCard;
