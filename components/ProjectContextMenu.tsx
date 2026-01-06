import React, { useRef, useEffect, useState } from 'react';
import { Project } from '../types';
import { useSettings } from '../contexts/SettingsContext';

// --- Icons ---
const OpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;
const RenameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const DuplicateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18" /><path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12" /></svg>;


interface ProjectContextMenuProps {
    project: Project;
    onClose: () => void;
    onOpen: () => void;
    onRename: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

const ProjectContextMenu: React.FC<ProjectContextMenuProps> = ({
    project,
    onClose,
    onOpen,
    onRename,
    onDuplicate,
    onDelete,
}) => {
    const { t } = useSettings();

    const ActionButton: React.FC<{onClick: () => void, children: React.ReactNode, className?: string}> = ({ onClick, children, className }) => (
        <li>
            <button
                onClick={onClick}
                className={`w-full flex items-center px-4 py-4 text-sm rounded-lg transition-colors bg-[var(--panel-bg)] hover:bg-[var(--border-color)] active:scale-95 text-[var(--text-color)] ${className}`}
            >
                {children}
            </button>
        </li>
    );

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
             <div
                style={{ width: '300px' }}
                className="bg-[var(--panel-bg)] border border-[var(--border-color)] p-2 rounded-xl shadow-xl animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-4 py-3 border-b border-[var(--border-color)] mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--text-color)] truncate" title={project.name}>
                        {project.name}
                    </h3>
                     <button onClick={onClose} className="h-10 w-10 bg-transparent hover:bg-[var(--border-color)] active:scale-95 text-[var(--text-color)] flex items-center justify-center rounded-lg transition-colors" aria-label={t.create_project_close_aria}>
                        <CloseIcon />
                    </button>
                </div>
                <ul className="space-y-1">
                    <ActionButton onClick={onOpen}>
                        <OpenIcon /> {t.project_menu_open}
                    </ActionButton>
                    <ActionButton onClick={onRename}>
                        <RenameIcon /> {t.project_menu_rename}
                    </ActionButton>
                    <ActionButton onClick={onDuplicate}>
                        <DuplicateIcon /> {t.project_menu_duplicate}
                    </ActionButton>
                    <div className="h-px bg-[var(--border-color)] my-1"></div>
                    <ActionButton onClick={onDelete} className="hover:bg-red-500/10 text-red-500">
                        <DeleteIcon /> {t.project_menu_delete}
                    </ActionButton>
                </ul>
            </div>
        </div>
    );
};

export default ProjectContextMenu;
