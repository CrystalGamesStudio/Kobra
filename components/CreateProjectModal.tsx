import React, { useState, useEffect } from 'react';
import { EditorType } from '../types';
import { EDITORS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';

interface ProjectCreationDetails {
    name: string;
    description: string;
    editorType: EditorType;
}

interface CreateProjectModalProps {
    onClose: () => void;
    onCreateProject: (details: ProjectCreationDetails) => void;
    onStartStream: (editorType: EditorType) => void;
    isQuickCreate?: boolean;
}

const EditorCard: React.FC<{ 
    type: EditorType; 
    name: string; 
    icon: React.ReactNode; 
    description: string; 
    enabled: boolean; 
    isSelected: boolean;
    onSelect: (type: EditorType) => void;
    comingSoonText: string;
}> = ({ type, name, icon, description, enabled, isSelected, onSelect, comingSoonText }) => {
    
    const baseClasses = "p-6 rounded-xl flex flex-col items-center text-center transition-all duration-200 text-[var(--text-color)] border";
    const enabledClasses = "cursor-pointer bg-[var(--panel-bg)] border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-md";
    const disabledClasses = "opacity-50 cursor-not-allowed bg-[var(--bg-color)] border-[var(--border-color)]";
    const selectedClasses = "bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-md";

    return (
        <div 
            onClick={() => enabled && onSelect(type)}
            className={`${baseClasses} ${enabled ? (isSelected ? selectedClasses : enabledClasses) : disabledClasses}`}
        >
            <div className={`text-[var(--accent-color)] mb-3 ${isSelected ? '' : 'text-[var(--text-color-light)]'}`}>{icon}</div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-[var(--text-color-light)] mt-1 flex-grow">{description}</p>
            {!enabled && <span className="text-xs text-yellow-400 font-semibold mt-3">{comingSoonText}</span>}
        </div>
    );
};

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreateProject, onStartStream, isQuickCreate = false }) => {
    const { t } = useSettings();

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedEditor, setSelectedEditor] = useState<EditorType | null>(null);

    const handleCreateClick = () => {
        if (!selectedEditor) return;

        if (isQuickCreate) {
            onStartStream(selectedEditor);
        } else {
            if (projectName.trim()) {
                onCreateProject({
                    name: projectName.trim(),
                    description: projectDescription.trim(),
                    editorType: selectedEditor
                });
            }
        }
    };

    const isButtonDisabled = isQuickCreate ? !selectedEditor : (!selectedEditor || !projectName.trim());
    const modalTitle = isQuickCreate ? t.create_project_select_editor_title : t.create_project_title;
    const buttonText = isQuickCreate ? t.create_project_start_button : t.create_project_button;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--panel-bg)] w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-xl border border-[var(--border-color)] animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-[var(--text-color)]">{modalTitle}</h2>
                    <button onClick={onClose} className="h-12 w-12 bg-transparent hover:bg-[var(--border-color)] active:scale-95 text-[var(--text-color)] flex items-center justify-center rounded-lg transition-colors" aria-label={t.create_project_close_aria}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-8 space-y-8 overflow-y-auto">
                    {!isQuickCreate && (
                        <div className="space-y-6 text-[var(--text-color)]">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium mb-2 text-[var(--text-color-light)]">{t.create_project_name_label}</label>
                                <input
                                    type="text"
                                    id="projectName"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder={t.create_project_name_placeholder}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                />
                            </div>
                            <div>
                                <label htmlFor="projectDescription" className="block text-sm font-medium mb-2 text-[var(--text-color-light)]">{t.create_project_description_label}</label>
                                <textarea
                                    id="projectDescription"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder={t.create_project_description_placeholder}
                                    rows={3}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-lg font-medium text-[var(--text-color)] mb-4">{t.create_project_select_editor}</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {EDITORS.map(editor => (
                                <EditorCard 
                                    key={editor.type}
                                    type={editor.type}
                                    name={t[editor.nameKey as keyof typeof t]}
                                    icon={editor.icon}
                                    description={t[editor.descriptionKey as keyof typeof t]}
                                    enabled={editor.enabled}
                                    isSelected={selectedEditor === editor.type}
                                    onSelect={setSelectedEditor}
                                    comingSoonText={t.editor_coming_soon}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[var(--border-color)] mt-auto flex-shrink-0 flex justify-end">
                     <button
                        onClick={handleCreateClick}
                        disabled={isButtonDisabled}
                        className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-bold py-4 px-10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
