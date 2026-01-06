import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface DashboardProps {
    projects: Project[];
    onOpenProjectMenu: (project: Project, event: React.MouseEvent) => void;
    onStartStreamingClick: () => void;
    onOpenCreateProjectModal: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onOpenProjectMenu, onStartStreamingClick, onOpenCreateProjectModal }) => {
    const { t } = useSettings();

    const stats = [
        { label: t.dashboard_stats_followers, value: '0', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> },
        { label: t.dashboard_stats_viewers, value: '0', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
        { label: t.dashboard_stats_streams, value: '0', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" ry="2" /></svg> },
        { label: t.dashboard_stats_time, value: '0h 0m', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
    ];

    const recentProjects = projects.slice(0, 4);

    return (
        <div className="space-y-8 text-[var(--text-color)]">
            <div className="p-10 rounded-xl bg-[var(--accent-color)] text-white animate-fade-in-up">
                <h1 className="text-4xl font-extrabold">{t.dashboard_welcome}</h1>
                <p className="mt-2 text-lg opacity-90">{t.dashboard_subtitle}</p>
                <div className="flex items-center space-x-4 mt-6">
                    <button onClick={onStartStreamingClick} className="bg-white/20 text-white hover:bg-white/30 active:scale-95 font-bold py-3 px-8 rounded-lg transition-colors">
                        {t.dashboard_start_streaming}
                    </button>
                     <button onClick={onOpenCreateProjectModal} className="bg-white/20 text-white hover:bg-white/30 active:scale-95 font-bold py-3 px-8 rounded-lg transition-colors">
                        {t.dashboard_start_project}
                    </button>
                </div>
            </div>

            <div className="opacity-0 animate-fade-in-up animation-delay-100">
                 <h2 className="text-2xl font-bold mb-4">{t.dashboard_stats_title}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div 
                            key={stat.label} 
                            className="bg-[var(--panel-bg)] border border-[var(--border-color)] p-6 flex items-center gap-6 rounded-xl opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${100 + index * 100}ms` }}
                        >
                            <div className={`bg-[var(--bg-color)] h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-full`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-color-light)]">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="opacity-0 animate-fade-in-up animation-delay-500">
                <h2 className="text-2xl font-bold mb-4">{t.dashboard_projects_title}</h2>
                 {recentProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                         {recentProjects.map(project => (
                             <ProjectCard key={project.id} project={project} onOpenMenu={onOpenProjectMenu} />
                         ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-6 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl">
                        <p className="text-[var(--text-color-light)]">{t.dashboard_projects_empty}</p>
                        <button onClick={onOpenCreateProjectModal} className="mt-4 text-[var(--accent-color)] font-semibold hover:opacity-80">
                            {t.dashboard_projects_create}
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default Dashboard;
