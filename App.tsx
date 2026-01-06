import React, { useState, useCallback, useEffect } from 'react';
import { EditorType, Project, Recording } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StreamView from './components/StreamView';
import CreateProjectModal from './components/CreateProjectModal';
import StreamConfirmationModal from './components/StreamConfirmationModal';
import ContactModal from './components/ContactModal';
import ChesterView from './components/ChesterView';
import SettingsView from './components/SettingsView';
import ProjectsView from './components/ProjectsView';
import ExploreView from './components/ExploreView';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AuthLoading from './components/AuthLoading';
import ProjectContextMenu from './components/ProjectContextMenu';
import RenameProjectModal from './components/RenameProjectModal';
import Notification from './components/Notification';
import { onAuthStateChanged, signOutUser, User } from './services/authService';
import { getProjects, createProject, deleteProject, updateProject } from './services/projectService';
import { uploadRecording, saveRecordingMetadata } from './services/recordingService';
import { useRecorder } from './hooks/useRecorder';
import { useSettings } from './contexts/SettingsContext';


interface ProjectCreationDetails {
    name: string;
    description: string;
    editorType: EditorType;
}

const App: React.FC = () => {
    const { t, theme } = useSettings();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isQuickCreateMode, setIsQuickCreateMode] = useState(false);
    
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    const [isLive, setIsLive] = useState(false);
    const [mainView, setMainView] = useState<'dashboard' | 'chester' | 'settings' | 'projects' | 'explore'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Auth state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [unauthenticatedView, setUnauthenticatedView] = useState<'landing' | 'login'>('landing');

    // Context Menu and Rename Modal State
    const [contextMenuProject, setContextMenuProject] = useState<Project | null>(null);
    const [renameModalProject, setRenameModalProject] = useState<Project | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState<{ 
        message: string; 
        type?: 'info' | 'warning' | 'success' | 'error';
        actions?: Array<{ label: string; onClick: () => void; variant?: 'primary' | 'secondary' }>;
    } | null>(null);
    const [lastClosedProject, setLastClosedProject] = useState<Project | null>(null);
    
    // Recording Logic
    const handleStopRecordingCallback = useCallback(async (blob: Blob, duration: number) => {
        if (!currentUser || !activeProject) return;

        setIsProcessing(true);
        try {
            const videoUrl = await uploadRecording(currentUser.uid, blob);
            
            const userPhotoURL = currentUser.photoURL || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${currentUser.uid}&backgroundColor=${theme === 'dark' ? '4a5568' : 'e2e8f0'}`;

            const recordingData: Omit<Recording, 'id' | 'createdAt'> = {
                userId: currentUser.uid,
                userDisplayName: currentUser.isAnonymous ? t.header_guest_user : currentUser.email || 'Anonymous',
                userPhotoURL: userPhotoURL,
                projectId: activeProject.id,
                projectName: activeProject.name,
                projectEditorType: activeProject.editorType,
                videoUrl,
                duration,
            };

            await saveRecordingMetadata(recordingData);

        } catch (error) {
            console.error("Failed to process recording:", error);
            // In a real app, show a user-facing error message
        } finally {
            setIsProcessing(false);
        }

    }, [currentUser, activeProject, theme, t.header_guest_user]);

    const { isRecording, startRecording, stopRecording } = useRecorder(handleStopRecordingCallback);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(user => {
            setTimeout(() => { // Artificial delay to see loading spinner
                setCurrentUser(user);
                setAuthLoading(false);
                if (!user) {
                    setUnauthenticatedView('landing');
                    setProjects([]);
                    setActiveProject(null);
                }
            }, 1500);
        });
        return () => unsubscribeAuth();
    }, []);
    
    useEffect(() => {
        // This effect manages the global scroll behavior.
        // The main app should not scroll, but the landing/login pages should.
        const body = document.body;
        if (currentUser) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
        // Cleanup function to ensure scrolling is re-enabled if the component unmounts unexpectedly.
        return () => {
            body.style.overflow = 'auto';
        };
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const unsubscribeProjects = getProjects(currentUser.uid, setProjects);
            return () => unsubscribeProjects();
        }
    }, [currentUser]);
    
    useEffect(() => {
        // This effect runs after a project is created and set as active.
        if (activeProject && !findItemById(projects, activeProject.id)) {
            // Only open the confirmation modal for persistent projects, not quick streams.
            if (!activeProject.id.startsWith('quick-stream')) {
                 setIsConfirmationModalOpen(true);
            }
        }
    }, [activeProject, projects]);


    const handleStartStreamingClick = useCallback(() => {
        setIsQuickCreateMode(true);
        setIsModalOpen(true);
    }, []);
    
    const handleOpenCreateProjectModal = useCallback(() => {
        setIsQuickCreateMode(false);
        setIsModalOpen(true);
    }, []);

    const handleNavigate = useCallback((view: 'dashboard' | 'chester' | 'projects' | 'explore') => {
        if (!activeProject) {
            setMainView(view);
        }
    }, [activeProject]);

    const handleSettingsClick = useCallback(() => {
        if (!activeProject) {
            setMainView('settings');
        }
    }, [activeProject]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setIsQuickCreateMode(false);
    }, []);
    
    const handleStartQuickStream = useCallback((editorType: EditorType) => {
        if (!currentUser) return;
        handleCloseModal();

        const quickStreamProject: Project = {
            id: `quick-stream-${Date.now()}`,
            name: t.quick_stream_default_name,
            editorType: editorType,
            createdAt: Date.now(),
            userId: currentUser.uid,
        };
        setActiveProject(quickStreamProject);
        // For quick streams, we immediately go live or prepare. Let's default to prepare.
        setIsConfirmationModalOpen(true);
    }, [currentUser, handleCloseModal, t.quick_stream_default_name]);

    const handleCreateProject = useCallback(async ({ name, description, editorType }: ProjectCreationDetails) => {
        if (!currentUser) return;
        
        handleCloseModal();
        setIsProcessing(true);
        const finalName = name.trim() ? name.trim() : `Untitled Project - ${new Date().toLocaleDateString()}`;

        try {
            const newProject = await createProject(currentUser.uid, finalName, editorType, description);
            setActiveProject(newProject);
            window.location.reload();
        } catch (error) {
            console.error("Failed to create project:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [currentUser, handleCloseModal]);
    
    const findItemById = (items: Project[], id: string) => items.find(item => item.id === id);


    const handleOpenProject = useCallback((project: Project) => {
        setActiveProject(project);
        setContextMenuProject(null);
    }, []);
    
    const handleOpenProjectMenu = useCallback((project: Project, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenuProject(project);
    }, []);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenuProject(null);
    }, []);

    const handleShowRenameModal = useCallback((project: Project) => {
        setRenameModalProject(project);
        setContextMenuProject(null);
    }, []);

    const handleCloseRenameModal = useCallback(() => {
        setRenameModalProject(null);
    }, []);

    const handleUpdateProject = useCallback(async (projectId: string, name: string, description: string) => {
        setIsProcessing(true);
        try {
            await updateProject(projectId, name, description);
            handleCloseRenameModal();
        } catch (error) {
            console.error("Failed to update project:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [handleCloseRenameModal]);
    
    const handleDuplicateProject = useCallback(async (project: Project) => {
        if (!currentUser) return;
        setContextMenuProject(null);
        setIsProcessing(true);
        try {
            const newName = `${project.name} (${t.project_menu_copy})`;
            await createProject(currentUser.uid, newName, project.editorType, project.description);
        } catch (error) {
            console.error("Failed to duplicate project:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [currentUser, t]);

    const handleDeleteProject = useCallback(async (project: Project) => {
        setContextMenuProject(null);
        const confirmMessage = t.delete_project_modal_confirm.replace('{name}', project.name);
        if (window.confirm(confirmMessage)) {
            setIsProcessing(true);
            try {
                await deleteProject(project.id);
            } catch (error) {
                console.error("Failed to delete project:", error);
            } finally {
                setIsProcessing(false);
            }
        }
    }, [t]);


    const handleEndStream = useCallback(() => {
        const hadActiveStream = activeProject !== null;
        const wasLive = isLive;
        const wasRecording = isRecording;
        const projectToSave = activeProject;
        
        if (isRecording) {
            stopRecording();
        }
        setActiveProject(null);
        setIsLive(false);
        setIsConfirmationModalOpen(false);
        setMainView('dashboard');
        
        // Show notification if there was an active stream
        if (hadActiveStream && projectToSave) {
            setLastClosedProject(projectToSave);
            let message = '';
            if (wasLive && wasRecording) {
                message = t.notification_stream_ended_recording || 'Stream został zakończony. Nagrywanie zostało zatrzymane.';
            } else if (wasLive) {
                message = t.notification_stream_ended || 'Stream został zakończony.';
            } else if (wasRecording) {
                message = t.notification_recording_stopped || 'Nagrywanie zostało zatrzymane.';
            } else {
                message = t.notification_project_closed || 'Projekt został zamknięty. Możesz do niego wrócić z listy projektów.';
            }
            
            setNotification({ 
                message, 
                type: 'error',
                actions: [
                    {
                        label: t.notification_back_to_stream || 'Wróć do stream',
                        onClick: () => {
                            if (projectToSave) {
                                setActiveProject(projectToSave);
                                if (wasLive) {
                                    setIsLive(true);
                                }
                            }
                        },
                        variant: 'primary'
                    },
                    {
                        label: t.notification_close || 'Zamknij',
                        onClick: () => {
                            setLastClosedProject(null);
                        },
                        variant: 'secondary'
                    }
                ]
            });
        }
    }, [isRecording, stopRecording, activeProject, isLive, t]);
    
    const handleStartLive = useCallback(() => {
        setIsLive(true);
        setIsConfirmationModalOpen(false);
    }, []);
    
    const handlePrepare = useCallback(() => {
        setIsLive(false);
        setIsConfirmationModalOpen(false);
    }, []);

    const handleGoLive = useCallback(() => {
        setIsLive(true);
    }, []);
    
    const handleStartRecording = useCallback(() => {
        startRecording();
    }, [startRecording]);

    const handleStopRecording = useCallback(() => {
        stopRecording();
    }, [stopRecording]);

    const handleContactClick = useCallback(() => {
        setIsContactModalOpen(true);
    }, []);

    const handleCloseContactModal = useCallback(() => {
        setIsContactModalOpen(false);
    }, []);

    const handleLogout = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const renderMainView = () => {
        if (activeProject) {
             return <StreamView editorType={activeProject.editorType} onBack={handleEndStream} />;
        }
        switch (mainView) {
            case 'chester':
                return <ChesterView />;
            case 'settings':
                return <SettingsView />;
            case 'projects':
                return <ProjectsView projects={projects} onOpenProjectMenu={handleOpenProjectMenu} onCreateNewProjectClick={handleOpenCreateProjectModal} />;
            case 'explore':
                return <ExploreView />;
            case 'dashboard':
            default:
                return <Dashboard 
                    projects={projects} 
                    onOpenProjectMenu={handleOpenProjectMenu} 
                    onStartStreamingClick={handleStartStreamingClick}
                    onOpenCreateProjectModal={handleOpenCreateProjectModal}
                />;
        }
    };
    
    if (authLoading) {
        return <AuthLoading />;
    }

    if (!currentUser) {
        if (unauthenticatedView === 'landing') {
            return <LandingPage onNavigateToLogin={() => setUnauthenticatedView('login')} />;
        }
        return <LoginPage />;
    }

    const anyModalOpen = isModalOpen || isConfirmationModalOpen || isContactModalOpen || !!contextMenuProject || !!renameModalProject;

    return (
        <>
            <div className="h-screen w-screen p-2 sm:p-3 md:p-5 overflow-hidden">
                <div className="flex h-full w-full gap-2 sm:gap-3 md:gap-4">
                    {!activeProject && (
                        <>
                            {/* Desktop Sidebar */}
                            <div className="hidden lg:block">
                                <Sidebar 
                                    onStartStreamingClick={handleStartStreamingClick}
                                    onNavigate={handleNavigate}
                                    activeView={mainView}
                                    onContactClick={handleContactClick}
                                    onSettingsClick={handleSettingsClick}
                                    user={currentUser}
                                    onLogout={handleLogout}
                                />
                            </div>
                            
                            {/* Mobile Menu Overlay */}
                            {isMobileMenuOpen && (
                                <div 
                                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            )}
                            
                            {/* Mobile Sidebar */}
                            <div className={`fixed left-0 top-0 h-full z-50 lg:hidden transition-transform duration-300 ${
                                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}>
                                <Sidebar 
                                    onStartStreamingClick={() => {
                                        handleStartStreamingClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    onNavigate={(view) => {
                                        handleNavigate(view);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    activeView={mainView}
                                    onContactClick={() => {
                                        handleContactClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    onSettingsClick={() => {
                                        handleSettingsClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    user={currentUser}
                                    onLogout={handleLogout}
                                />
                            </div>
                            
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden fixed top-4 left-4 z-40 bg-[var(--panel-bg)] border border-[var(--border-color)] h-12 w-12 flex items-center justify-center rounded-lg text-[var(--text-color)] hover:bg-[var(--border-color)] transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </>
                    )}
                    <div className="flex flex-1 flex-col gap-2 sm:gap-3 md:gap-4 min-h-0 w-full lg:ml-0 ml-0">
                        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[var(--panel-bg)] rounded-xl shadow-sm border border-[var(--border-color)]">
                            {renderMainView()}
                        </main>
                    </div>
                </div>
            </div>
            {anyModalOpen && <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" />}
            {isModalOpen && (
                <CreateProjectModal
                    onClose={handleCloseModal}
                    onCreateProject={handleCreateProject}
                    onStartStream={handleStartQuickStream}
                    isQuickCreate={isQuickCreateMode}
                />
            )}
            {isConfirmationModalOpen && activeProject && (
                <StreamConfirmationModal
                    onStartLive={handleStartLive}
                    onPrepare={handlePrepare}
                />
            )}
            {isContactModalOpen && (
                <ContactModal onClose={handleCloseContactModal} />
            )}
            {contextMenuProject && (
                <ProjectContextMenu
                    project={contextMenuProject}
                    onClose={handleCloseContextMenu}
                    onOpen={() => handleOpenProject(contextMenuProject)}
                    onRename={() => handleShowRenameModal(contextMenuProject)}
                    onDuplicate={() => handleDuplicateProject(contextMenuProject)}
                    onDelete={() => handleDeleteProject(contextMenuProject)}
                />
            )}
            {renameModalProject && (
                <RenameProjectModal
                    project={renameModalProject}
                    onClose={handleCloseRenameModal}
                    onSave={handleUpdateProject}
                />
            )}
            {isProcessing && (
                <div className="processing-overlay animate-fade-in">
                    <div className="loader">
                      <div className="box1"></div>
                      <div className="box2"></div>
                      <div className="box3"></div>
                    </div>
                </div>
            )}
            {notification && (
                <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => {
                            setNotification(null);
                            setLastClosedProject(null);
                        }}
                        actions={notification.actions}
                    />
                </div>
            )}
        </>
    );
};

export default App;