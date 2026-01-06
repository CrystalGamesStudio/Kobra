import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import { useSettings } from '../contexts/SettingsContext';

interface ProjectsViewProps {
    projects: Project[];
    onOpenProjectMenu: (project: Project, event: React.MouseEvent) => void;
    onCreateNewProjectClick: () => void;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
    </svg>
);

const EmptyStateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-[var(--text-color-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);


const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onOpenProjectMenu, onCreateNewProjectClick }) => {
    const { t } = useSettings();

    return (
        <div className="space-y-8 animate-fade-in text-[var(--text-color)]">
            <div className="p-10 rounded-xl bg-[var(--accent-color)] text-white animate-fade-in-up">
                <h1 className="text-4xl font-extrabold">{t.projects_banner_title}</h1>
                <p className="mt-2 text-lg opacity-90">{t.projects_banner_subtitle}</p>
                <div className="flex items-center space-x-4 mt-6">
                    <button onClick={onCreateNewProjectClick} className="bg-white/20 text-white hover:bg-white/30 active:scale-95 font-bold py-3 px-8 rounded-lg flex items-center transition-colors">
                        <PlusIcon />
                        {t.projects_create_new}
                    </button>
                </div>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} onOpenMenu={onOpenProjectMenu} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl">
                    <EmptyStateIcon />
                    <h3 className="mt-4 text-xl font-medium">{t.dashboard_projects_empty}</h3>
                    <p className="mt-1 text-[var(--text-color-light)]">{t.projects_empty_subtitle}</p>
                    <button onClick={onCreateNewProjectClick} className="mt-6 bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] active:scale-95 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors mx-auto">
                         <PlusIcon />
                        {t.dashboard_projects_create}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectsView;
