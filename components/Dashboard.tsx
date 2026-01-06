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
        { 
            label: t.dashboard_stats_followers, 
            value: '0', 
            icon: (
                <svg className="h-7 w-7 text-pink-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            label: t.dashboard_stats_viewers, 
            value: '0', 
            icon: (
                <svg className="h-7 w-7 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            label: t.dashboard_stats_streams, 
            value: '0', 
            icon: (
                <svg className="h-7 w-7 text-green-400" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="12" d="M46 162h100c8.837 0 16-7.163 16-16V60l-30-30H46c-8.837 0-16 7.163-16 16v100c0 8.837 7.163 16 16 16Z"/>
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M54 160v-50a8 8 0 0 1 8-8h68a8 8 0 0 1 8 8v50m-6-130v44a8 8 0 0 1-8 8H62a8 8 0 0 1-8-8V30m20 92h44m-44 20h44"/>
                    <rect width="20" height="24" x="98" y="44" fill="currentColor" rx="6"/>
                </svg>
            )
        },
        { 
            label: t.dashboard_stats_time, 
            value: '0h 0m', 
            icon: (
                <svg className="h-7 w-7 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7V12H17M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        }
    ];

    const recentProjects = projects.slice(0, 4);

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-[var(--text-color)]">
            <div className="p-4 sm:p-6 md:p-10 rounded-xl bg-[var(--accent-color)] text-white animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{t.dashboard_welcome}</h1>
                <p className="mt-2 text-sm sm:text-base md:text-lg opacity-90">{t.dashboard_subtitle}</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <button onClick={onStartStreamingClick} className="bg-white/20 text-white hover:bg-white/30 active:scale-95 font-bold py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg transition-colors text-sm sm:text-base">
                        {t.dashboard_start_streaming}
                    </button>
                     <button onClick={onOpenCreateProjectModal} className="bg-white/20 text-white hover:bg-white/30 active:scale-95 font-bold py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg transition-colors text-sm sm:text-base">
                        {t.dashboard_start_project}
                    </button>
                </div>
            </div>

            <div className="opacity-0 animate-fade-in-up animation-delay-100">
                 <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t.dashboard_stats_title}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <div 
                            key={stat.label} 
                            className="bg-[var(--panel-bg)] border border-[var(--border-color)] p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 rounded-xl opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${100 + index * 100}ms` }}
                        >
                            <p className="text-xs sm:text-sm text-[var(--text-color-light)]">{stat.label}</p>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0 flex items-center justify-center">
                                    {stat.icon}
                                </div>
                                <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="opacity-0 animate-fade-in-up animation-delay-500">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t.dashboard_projects_title}</h2>
                 {recentProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                         {recentProjects.map(project => (
                             <ProjectCard key={project.id} project={project} onOpenMenu={onOpenProjectMenu} />
                         ))}
                    </div>
                ) : (
                    <div className="text-center py-6 sm:py-8 md:py-10 px-4 sm:px-6 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl">
                        <p className="text-sm sm:text-base text-[var(--text-color-light)]">{t.dashboard_projects_empty}</p>
                        <button onClick={onOpenCreateProjectModal} className="mt-3 sm:mt-4 text-sm sm:text-base text-[var(--accent-color)] font-semibold hover:opacity-80">
                            {t.dashboard_projects_create}
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default Dashboard;
