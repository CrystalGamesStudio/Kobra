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
    
    // Auth state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [unauthenticatedView, setUnauthenticatedView] = useState<'landing' | 'login'>('landing');

    // Context Menu and Rename Modal State
    const [contextMenuProject, setContextMenuProject] = useState<Project | null>(null);
    const [renameModalProject, setRenameModalProject] = useState<Project | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
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
        if (isRecording) {
            stopRecording();
        }
        setActiveProject(null);
        setIsLive(false);
        setIsConfirmationModalOpen(false);
        setMainView('dashboard');
    }, [isRecording, stopRecording]);
    
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
             return <StreamView editorType={activeProject.editorType} />;
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
            <div className="h-screen w-screen p-5">
                <div className="flex h-full w-full gap-4">
                    {!activeProject && (
                         <Sidebar 
                            onStartStreamingClick={handleStartStreamingClick}
                            onNavigate={handleNavigate}
                            activeView={mainView}
                            onContactClick={handleContactClick}
                            onSettingsClick={handleSettingsClick}
                            user={currentUser}
                            onLogout={handleLogout}
                        />
                    )}
                    <div className="flex flex-1 flex-col gap-4 min-h-0">
                        <main className="flex-1 overflow-y-auto p-8 bg-[var(--panel-bg)] rounded-xl shadow-sm border border-[var(--border-color)]">
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
        </>
    );
};

export default App;