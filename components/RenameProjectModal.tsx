import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface RenameProjectModalProps {
    project: Project;
    onClose: () => void;
    onSave: (projectId: string, name: string, description: string) => void;
}

const RenameProjectModal: React.FC<RenameProjectModalProps> = ({ project, onClose, onSave }) => {
    const { t } = useSettings();
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(project.id, name.trim(), description.trim());
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-[var(--panel-bg)] w-full max-w-lg rounded-2xl shadow-xl border border-[var(--border-color)] animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">{t.rename_project_modal_title}</h2>
                    <button onClick={onClose} className="h-12 w-12 bg-transparent hover:bg-[var(--border-color)] active:scale-95 text-[var(--text-color)] flex items-center justify-center rounded-lg transition-colors" aria-label={t.create_project_close_aria}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                
                <form onSubmit={handleSave}>
                    <div className="p-8 space-y-6 text-[var(--text-color)]">
                        <div>
                            <label htmlFor="projectName" className="block text-sm font-medium mb-2 text-[var(--text-color-light)]">{t.create_project_name_label}</label>
                            <input
                                type="text"
                                id="projectName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.create_project_name_placeholder}
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="projectDescription" className="block text-sm font-medium mb-2 text-[var(--text-color-light)]">{t.create_project_description_label}</label>
                            <textarea
                                id="projectDescription"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={t.create_project_description_placeholder}
                                rows={4}
                                className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                            />
                        </div>
                    </div>

                    <div className="p-6 border-t border-[var(--border-color)] flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-[var(--panel-bg)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-color)] font-bold py-3 px-8 rounded-lg active:scale-95 transition-colors"
                        >
                            {t.rename_project_modal_cancel_button}
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-bold py-3 px-8 rounded-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t.rename_project_modal_save_button}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RenameProjectModal;
