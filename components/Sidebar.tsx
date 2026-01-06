import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { User } from '../services/authService';

const NavIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="flex-shrink-0 w-7 h-7">{children}</span>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.2796 3.71579C12.097 3.66261 11.903 3.66261 11.7203 3.71579C11.6678 3.7311 11.5754 3.7694 11.3789 3.91817C11.1723 4.07463 10.9193 4.29855 10.5251 4.64896L5.28544 9.3064C4.64309 9.87739 4.46099 10.0496 4.33439 10.24C4.21261 10.4232 4.12189 10.6252 4.06588 10.8379C4.00765 11.0591 3.99995 11.3095 3.99995 12.169V16C3.99995 16.9456 4.0005 17.6047 4.03569 18.1205C4.07028 18.6275 4.13496 18.9227 4.22832 19.148C4.5328 19.8831 5.11682 20.4672 5.8519 20.7716C6.07729 20.865 6.37249 20.9297 6.8794 20.9643C7.3953 20.9995 8.05439 21 8.99995 21H15C15.9455 21 16.6046 20.9995 17.1205 20.9643C17.6274 20.9297 17.9226 20.865 18.148 20.7716C18.8831 20.4672 19.4671 19.8831 19.7716 19.148C19.8649 18.9227 19.9296 18.6275 19.9642 18.1205C19.9994 17.6047 20 16.9456 20 16V12.169C20 11.3095 19.9923 11.0591 19.934 10.8379C19.878 10.6252 19.7873 10.4232 19.6655 10.24C19.5389 10.0496 19.3568 9.87739 18.7145 9.3064L13.4748 4.64896C13.0806 4.29855 12.8276 4.07463 12.621 3.91817C12.4245 3.7694 12.3321 3.7311 12.2796 3.71579ZM11.1611 1.79556C11.709 1.63602 12.2909 1.63602 12.8388 1.79556C13.2189 1.90627 13.5341 2.10095 13.8282 2.32363C14.1052 2.53335 14.4172 2.81064 14.7764 3.12995L20.0432 7.81159C20.0716 7.83679 20.0995 7.86165 20.1272 7.88619C20.6489 8.34941 21.0429 8.69935 21.3311 9.13277C21.5746 9.49916 21.7561 9.90321 21.8681 10.3287C22.0006 10.832 22.0004 11.359 22 12.0566C22 12.0936 22 12.131 22 12.169V16.0355C22 16.9373 22 17.6647 21.9596 18.2567C21.918 18.8654 21.8305 19.4037 21.6194 19.9134C21.1119 21.1386 20.1385 22.1119 18.9134 22.6194C18.4037 22.8305 17.8654 22.9181 17.2566 22.9596C16.6646 23 15.9372 23 15.0355 23H8.96443C8.06267 23 7.33527 23 6.74326 22.9596C6.13452 22.9181 5.59624 22.8305 5.08654 22.6194C3.8614 22.1119 2.88803 21.1385 2.38056 19.9134C2.16943 19.4037 2.08187 18.8654 2.04033 18.2567C1.99994 17.6647 1.99995 16.9373 1.99995 16.0355L1.99995 12.169C1.99995 12.131 1.99993 12.0936 1.99992 12.0566C1.99955 11.359 1.99928 10.832 2.1318 10.3287C2.24383 9.90321 2.42528 9.49916 2.66884 9.13277C2.95696 8.69935 3.35105 8.34941 3.87272 7.8862C3.90036 7.86165 3.92835 7.83679 3.95671 7.81159L9.22354 3.12996C9.58274 2.81064 9.89467 2.53335 10.1717 2.32363C10.4658 2.10095 10.781 1.90627 11.1611 1.79556Z" />
    </svg>
);
const ProjectsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.17004 7.43994L12 12.5499L20.77 7.46994" />
        <path d="M12 21.61V12.54" />
        <path d="M9.93001 2.48004L4.59001 5.44004C3.38001 6.11004 2.39001 7.79004 2.39001 9.17004V14.82C2.39001 16.2 3.38001 17.88 4.59001 18.55L9.93001 21.52C11.07 22.15 12.94 22.15 14.08 21.52L19.42 18.55C20.63 17.88 21.62 16.2 21.62 14.82V9.17004C21.62 7.79004 20.63 6.11004 19.42 5.44004L14.08 2.47004C12.93 1.84004 11.07 1.84004 9.93001 2.48004Z" />
    </svg>
);
const ExploreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.90999 22.82C3.81999 22.82 2.88999 22.47 2.20999 21.79C1.23999 20.82 0.939994 19.34 1.36999 17.62L3.84999 7.69C4.27999 5.97 5.95999 4.3 7.66999 3.87L17.6 1.39C19.32 0.959998 20.8 1.26 21.77 2.23C22.74 3.2 23.04 4.68 22.61 6.4L20.13 16.33C19.7 18.05 18.02 19.72 16.31 20.15L6.37999 22.63C5.86999 22.75 5.37999 22.82 4.90999 22.82ZM17.98 2.83L8.04999 5.32C6.87999 5.61 5.60999 6.88 5.30999 8.05L2.82999 17.98C2.52999 19.17 2.68999 20.14 3.26999 20.73C3.84999 21.31 4.82999 21.47 6.01999 21.17L15.95 18.69C17.12 18.4 18.39 17.12 18.68 15.96L21.16 6.03C21.46 4.84 21.3 3.87 20.72 3.28C20.14 2.69 19.17 2.54 17.98 2.83Z" />
        <path d="M12 16.25C9.66 16.25 7.75 14.34 7.75 12C7.75 9.66 9.66 7.75 12 7.75C14.34 7.75 16.25 9.66 16.25 12C16.25 14.34 14.34 16.25 12 16.25ZM12 9.25C10.48 9.25 9.25 10.48 9.25 12C9.25 13.52 10.48 14.75 12 14.75C13.52 14.75 14.75 13.52 14.75 12C14.75 10.48 13.52 9.25 12 9.25Z" />
    </svg>
);
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z" />
    </svg>
);
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.50977 19.8018C8.83126 20.5639 10.3645 21 11.9996 21C16.9702 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6351 3.43604 15.1684 4.19819 16.4899L4.20114 16.495C4.27448 16.6221 4.31146 16.6863 4.32821 16.7469C4.34401 16.804 4.34842 16.8554 4.34437 16.9146C4.34003 16.9781 4.3186 17.044 4.27468 17.1758L3.50586 19.4823L3.50489 19.4853C3.34268 19.9719 3.26157 20.2152 3.31938 20.3774C3.36979 20.5187 3.48169 20.6303 3.62305 20.6807C3.78482 20.7384 4.02705 20.6577 4.51155 20.4962L4.51758 20.4939L6.82405 19.7251C6.95537 19.6813 7.02214 19.6591 7.08559 19.6548C7.14475 19.6507 7.19578 19.6561 7.25293 19.6719C7.31368 19.6887 7.37783 19.7257 7.50563 19.7994L7.50977 19.8018Z" />
    </svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.40894 3.94109C7.73727 3.44596 7.28496 3.33417 7.04226 3.38154C6.04101 3.57694 5.44749 3.96671 4.64337 4.77082C3.54575 5.86842 3.01318 6.68799 3.24513 7.93061C3.51219 9.36128 4.81689 11.5448 8.41291 15.1409C12.0087 18.7366 14.2054 20.0551 15.6441 20.3277C16.3108 20.4541 16.8185 20.3553 17.2741 20.1309C17.7612 19.891 18.2302 19.4872 18.7681 18.9258C19.2452 18.4279 19.5347 18.0804 19.7373 17.7385C19.9303 17.4128 20.0671 17.0527 20.1728 16.5118C20.2202 16.2691 20.1084 15.8168 19.6132 15.145C19.1513 14.5185 18.4997 13.8963 17.8973 13.3884C17.4998 13.0532 16.8848 13.0318 16.388 13.4037L14.8697 14.5404C13.5001 15.5656 11.5864 15.4188 10.3781 14.2104L9.34333 13.1757C8.13502 11.9674 7.98816 10.0537 9.0134 8.68411L10.15 7.16583C10.5219 6.66902 10.5005 6.05402 10.1653 5.65651C9.65746 5.05425 9.03533 4.40283 8.40894 3.94109ZM9.59567 2.33122C10.4051 2.9279 11.1441 3.71478 11.6943 4.3672C12.6971 5.55642 12.6153 7.20992 11.7511 8.3644L10.6145 9.88268C10.191 10.4483 10.2458 11.2497 10.7575 11.7615L11.7923 12.7962C12.3041 13.308 13.1054 13.3627 13.6711 12.9393L15.1894 11.8027C16.3439 10.9385 17.9973 10.8566 19.1865 11.8593C19.8391 12.4095 20.6262 13.1486 21.223 13.9582C21.7864 14.7225 22.3533 15.7809 22.1357 16.8953C21.9959 17.6108 21.7906 18.1965 21.4579 18.758C21.1348 19.3034 20.715 19.7848 20.2122 20.3095C19.6296 20.9176 18.9653 21.5274 18.1578 21.9251C17.3189 22.3383 16.3708 22.5011 15.2716 22.2928C13.1786 21.8961 10.6038 20.1601 6.99869 16.5551C3.39388 12.9502 1.66901 10.3864 1.27909 8.2976C0.854079 6.02071 2.03716 4.54859 3.22916 3.3566C4.21375 2.37202 5.14736 1.71361 6.65918 1.41857C7.7733 1.20114 8.83152 1.76792 9.59567 2.33122Z" />
    </svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.2 1.646a2.03 2.03 0 00-2.4 0c-.736.54-1.942 1.398-2.796 1.886-.794.453-1.894.935-2.635 1.242a2.046 2.046 0 00-1.244 2.161c.115.849.264 2.142.264 3.065 0 .906-.144 2.171-.258 3.021a2.05 2.05 0 001.34 2.199c.86.307 2.132.797 2.922 1.248.762.436 1.699 1.193 2.327 1.733a2.051 2.051 0 002.544.106c.743-.543 1.904-1.365 2.732-1.839.794-.453 1.894-.935 2.635-1.242a2.046 2.046 0 001.244-2.161c-.114-.848-.264-2.142-.264-3.065s.15-2.216.264-3.065a2.046 2.046 0 00-1.244-2.161c-.741-.307-1.841-.789-2.635-1.242-.854-.488-2.06-1.347-2.796-1.886zM9.983 3.259A.028.028 0 0110 3.253c.007 0 .013.002.017.006.732.536 2.022 1.458 2.987 2.01.911.52 2.112 1.042 2.861 1.352.008.004.016.01.022.02a.04.04 0 01.006.027c-.115.85-.282 2.262-.282 3.332 0 1.07.167 2.483.282 3.332a.04.04 0 01-.006.027.045.045 0 01-.022.02c-.75.31-1.95.832-2.861 1.353-.938.535-2.181 1.42-2.92 1.96a.036.036 0 01-.024.007.059.059 0 01-.036-.014c-.635-.546-1.697-1.415-2.639-1.953-.96-.55-2.387-1.09-3.24-1.396a.046.046 0 01-.025-.02.044.044 0 01-.007-.03c.114-.852.276-2.234.276-3.286 0-1.07-.167-2.483-.282-3.332a.04.04 0 01.006-.027.045.045 0 01.022-.02c.75-.31 1.95-.832 2.861-1.353.965-.551 2.255-1.473 2.987-2.01zM9 10a1 1 0 112 0 1 1 0 01-2 0zm1-3a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
    </svg>
);
const UserProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 32 32" fill="currentColor">
        <path d="M4 26.016q0 2.496 1.76 4.224t4.256 1.76h12q2.464 0 4.224-1.76t1.76-4.224q-0.448-2.688-2.112-4.928t-4.096-3.552q2.208-2.368 2.208-5.536v-4q0-3.296-2.336-5.632t-5.664-2.368-5.664 2.368-2.336 5.632v4q0 3.168 2.208 5.536-2.4 1.344-4.064 3.552t-2.144 4.928zM8 26.016q0.672-2.592 2.944-4.288t5.056-1.728 5.056 1.728 2.944 4.288q0 0.832-0.576 1.408t-1.408 0.576h-12q-0.832 0-1.44-0.576t-0.576-1.408zM12 12v-4q0-1.632 1.184-2.816t2.816-1.184 2.816 1.184 1.184 2.816v4q0 1.664-1.184 2.848t-2.816 1.152-2.816-1.152-1.184-2.848z"/>
    </svg>
);
const StartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
        <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
);
const MenuDuoIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
        <path d="M5 15H19M5 9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

type NavigableView = 'dashboard' | 'chester' | 'projects' | 'explore';
type ActiveView = NavigableView | 'settings';

interface SidebarProps {
    onStartStreamingClick: () => void;
    onNavigate: (view: NavigableView) => void;
    activeView: ActiveView;
    onContactClick: () => void;
    onSettingsClick: () => void;
    user: User;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onStartStreamingClick, onNavigate, activeView, onContactClick, onSettingsClick, user, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const { t, theme } = useSettings();

    const userAvatar = user.photoURL || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.uid || 'default'}&backgroundColor=${theme === 'dark' ? '4a5568' : 'e2e8f0'}`;
    const userDisplayName = user.isAnonymous ? t.header_guest_user : user.email;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const navItems = [
        { id: 'dashboard', icon: <HomeIcon />, label: t.sidebar_home },
        { id: 'projects', icon: <ProjectsIcon />, label: t.sidebar_projects },
        { id: 'followers', icon: <HeartIcon />, label: t.sidebar_followers },
        { id: 'explore', icon: <ExploreIcon />, label: t.sidebar_explore },
        { id: 'chester', icon: <ChatIcon />, label: t.sidebar_chester },
        { id: 'contact', icon: <PhoneIcon />, label: t.sidebar_contact },
        { id: 'settings', icon: <SettingsIcon />, label: t.settings },
    ];

    return (
        <aside className={`bg-[var(--panel-bg)] rounded-xl shadow-sm border border-[var(--border-color)] flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out p-3 h-full ${isCollapsed ? 'w-24' : 'w-64'}`}>
            <div className="p-1 flex items-center gap-2">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="bg-transparent hover:bg-[var(--border-color)] active:scale-95 transition-colors h-14 w-14 flex items-center justify-center text-[var(--text-color)] flex-shrink-0 rounded-lg"
                    aria-label={isCollapsed ? t.sidebar_expand : t.sidebar_collapse}
                >
                    <MenuDuoIcon />
                </button>
                
                <button
                    onClick={onStartStreamingClick}
                    className={`h-14 bg-[var(--accent-color)] text-white hover:bg-[var(--accent-color-hover)] active:scale-95 font-bold rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-14' : 'flex-grow'}`}
                >
                    <StartIcon />
                    {!isCollapsed && <span className="ml-2">{t.sidebar_start}</span>}
                </button>
            </div>

            <nav className="flex-1 px-1 py-4">
                <ul className="space-y-2">
                    {navItems.map(item => {
                        const isNavButton = ['dashboard', 'chester', 'projects'].includes(item.id);
                        const isContactButton = item.id === 'contact';
                        const isSettingsButton = item.id === 'settings';
                        const isDisabled = ['followers', 'explore'].includes(item.id);
                        const isActive = activeView === item.id;
                        const commonClasses = `flex items-center h-14 rounded-lg text-lg font-medium transition-all w-full text-left text-[var(--text-color)] ${isCollapsed ? 'justify-center' : 'px-4'}`;
                        
                        const activeClasses = 'bg-[var(--border-color)] text-[var(--accent-color)]';
                        const inactiveClasses = 'hover:bg-[var(--border-color)] active:scale-95';
                        
                        return (
                            <li key={item.label}>
                                {isNavButton ? (
                                    <button
                                        onClick={() => onNavigate(item.id as NavigableView)}
                                        className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                    >
                                        <NavIcon>{item.icon}</NavIcon>
                                        {!isCollapsed && <span className="ml-4">{item.label}</span>}
                                    </button>
                                ) : isContactButton ? (
                                    <button
                                        onClick={onContactClick}
                                        className={`${commonClasses} ${inactiveClasses}`}
                                    >
                                        <NavIcon>{item.icon}</NavIcon>
                                        {!isCollapsed && <span className="ml-4">{item.label}</span>}
                                    </button>
                                ) : isSettingsButton ? (
                                    <button
                                        onClick={onSettingsClick}
                                        className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                    >
                                        <NavIcon>{item.icon}</NavIcon>
                                        {!isCollapsed && <span className="ml-4">{item.label}</span>}
                                    </button>
                                ) : (
                                    <a href="#" className={`${commonClasses} ${inactiveClasses} opacity-50 cursor-not-allowed`}>
                                        <NavIcon>{item.icon}</NavIcon>
                                        {!isCollapsed && <span className="ml-4">{item.label}</span>}
                                    </a>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </nav>
            
            <div className="px-1 pb-1 border-t border-[var(--border-color)] pt-2">
                <div className="relative" ref={profileMenuRef}>
                    <button 
                        onClick={() => setIsProfileMenuOpen(prev => !prev)} 
                        className={`flex items-center h-14 rounded-lg text-lg font-medium transition-all w-full text-left text-[var(--text-color)] ${isCollapsed ? 'justify-center px-0' : 'px-4'} hover:bg-[var(--border-color)] active:scale-95`}
                    >
                        {isCollapsed ? (
                            <img className="h-10 w-10 rounded-md" src={userAvatar} alt="User" />
                        ) : (
                            <>
                                <img className="h-10 w-10 rounded-md mr-4" src={userAvatar} alt="User" />
                                <span className="truncate">{userDisplayName}</span>
                            </>
                        )}
                    </button>
                    {isProfileMenuOpen && (
                        <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'right-0'} bottom-full mb-4 w-56 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg shadow-lg p-1 z-20 animate-fade-in-up`}>
                            <div className="py-1">
                                {!user.isAnonymous && (
                                    <a href="#" className="block px-2 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--border-color)] rounded-md">{t.header_account}</a>
                                )}
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-2 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-[var(--border-color)] rounded-md transition-colors"
                                >
                                    {t.header_logout}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;