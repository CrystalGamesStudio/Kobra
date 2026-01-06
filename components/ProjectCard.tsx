import React from 'react';
import { Project } from '../types';
import { EDITORS } from '../constants';
import { useSettings } from '../contexts/SettingsContext';

interface ProjectCardProps {
    project: Project;
    onOpenMenu: (project: Project, event: React.MouseEvent) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenMenu }) => {
    const { t, language } = useSettings();
    const editorDetails = EDITORS.find(e => e.type === project.editorType);

    const formattedDate = new Date(project.createdAt).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const descriptionText = project.description || (editorDetails ? t[editorDetails.nameKey as keyof typeof t] : project.editorType);

    return (
        <div
            onClick={(e) => onOpenMenu(project, e)}
            className="bg-[var(--panel-bg)] p-4 sm:p-5 md:p-6 flex flex-col cursor-pointer transition-all duration-200 group border border-[var(--border-color)] rounded-xl hover:shadow-lg hover:border-[var(--accent-color)]"
        >
            <div className="flex items-center mb-3 sm:mb-4">
                <div className="text-[var(--text-color-light)] group-hover:text-[var(--accent-color)] mr-3 sm:mr-4 flex-shrink-0 bg-[var(--bg-color)] h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center rounded-full transition-colors">
                    {editorDetails?.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-color)] truncate group-hover:text-[var(--accent-color)] transition-colors" title={project.name}>
                    {project.name}
                </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-color-light)] flex-grow mb-3 sm:mb-4 break-words line-clamp-2" title={descriptionText}>
                {descriptionText}
            </p>
            <p className="text-xs text-[var(--text-color-light)] mt-auto pt-2 sm:pt-3 border-t border-[var(--border-color)]">{formattedDate}</p>
        </div>
    );
};

export default ProjectCard;