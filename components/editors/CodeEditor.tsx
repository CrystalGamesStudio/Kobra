import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

// --- ICONS ---

// Back Arrow Icon - arrow-left-sm-svgrepo-com.svg
const BackArrowIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 12H7M7 12L11 16M7 12L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Code Icon - Code Square 01 Icon.svg
const CodeIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 15L17.5 12L14.5 9M9.5 9L6.5 12L9.5 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Preview Icon - eye-svgrepo-com.svg
const PreviewIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Plus Icon - plus-svgrepo-com.svg
const PlusIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"/>
    </svg>
);

// Trash/Xmark Icon - xmark-svgrepo-com.svg
const TrashIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289Z"/>
    </svg>
);

// Folder Icon - folder-svgrepo-com(1).svg
const FolderIcon = ({ isOpen }: { isOpen?: boolean }) => (
    <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// File Icon - file-blank-svgrepo-com.svg
const FileIcon = () => (
    <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 3.00087C12.9045 3 12.7973 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.51921 21 7.079 21 8.19694 21L15.8031 21C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20296 19 9.09561 18.9991 9M13 3.00087C13.2856 3.00347 13.4663 3.01385 13.6388 3.05526C13.8429 3.10425 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59182 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53376 18.9963 8.71451 18.9991 9M13 3.00087V5.8C13 6.9201 13 7.47977 13.218 7.90759C13.4097 8.28392 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.9991M18.9991 9H19.0002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9 18 6-6-6-6" /></svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 9 6 6 6-6" /></svg>
);


// --- TYPES ---

interface CodeFile {
    id: string;
    name: string;
    type: 'file';
    content: string;
}

interface CodeFolder {
    id: string;
    name: string;
    type: 'folder';
    isOpen: boolean;
    children: ExplorerItem[];
}

type ExplorerItem = CodeFile | CodeFolder;


// --- INITIAL STATE ---

const initialItems: ExplorerItem[] = [
    {
        id: `file-${Date.now()}`,
        name: 'index.html',
        type: 'file',
        content: `<!-- Welcome to Kobra! -->
<h1>Code. Stream. Strike.</h1>
<p>You can create files and folders.</p>

<style>
  body { 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
    color: #1a202c;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    text-align: center;
  }
  h1 {
    color: #38a169;
    font-size: 3rem;
  }
</style>`
    }
];

// --- RECURSIVE HELPER FUNCTIONS ---

const findItemById = (items: ExplorerItem[], id: string): ExplorerItem | null => {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.type === 'folder') {
            const found = findItemById(item.children, id);
            if (found) return found;
        }
    }
    return null;
};

const findParentFolderId = (items: ExplorerItem[], childId: string): string | null => {
    // Inner recursive function that can return `undefined` if not found in a branch
    const find = (currentItems: ExplorerItem[], currentParentId: string | null): string | null | undefined => {
        for (const item of currentItems) {
            if (item.id === childId) {
                return currentParentId; // Found it, return its parent ID
            }
            if (item.type === 'folder') {
                const result = find(item.children, item.id);
                // If we found it in a sub-branch (result is not undefined), propagate it up.
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined; // Not found in this branch
    };

    const result = find(items, null);
    return result === undefined ? null : result;
};

const addItemToTree = (items: ExplorerItem[], parentId: string, newItem: ExplorerItem): ExplorerItem[] => {
    return items.map(item => {
        if (item.id === parentId && item.type === 'folder') {
            return { ...item, isOpen: true, children: [...item.children, newItem] };
        }
        if (item.type === 'folder') {
            return { ...item, children: addItemToTree(item.children, parentId, newItem) };
        }
        return item;
    });
};

const updateFileContentInTree = (items: ExplorerItem[], fileId: string, newContent: string): ExplorerItem[] => {
    return items.map(item => {
        if (item.id === fileId && item.type === 'file') {
            return { ...item, content: newContent };
        }
        if (item.type === 'folder') {
            return { ...item, children: updateFileContentInTree(item.children, fileId, newContent) };
        }
        return item;
    });
};

const deleteItemFromTree = (items: ExplorerItem[], idToDelete: string): ExplorerItem[] => {
    return items
        .filter(item => item.id !== idToDelete)
        .map(item => {
            if (item.type === 'folder') {
                return { ...item, children: deleteItemFromTree(item.children, idToDelete) };
            }
            return item;
        });
};

const toggleFolderInTree = (items: ExplorerItem[], folderId: string): ExplorerItem[] => {
    return items.map(item => {
       if (item.id === folderId && item.type === 'folder') {
           return { ...item, isOpen: !item.isOpen };
       }
       if (item.type === 'folder') {
           return { ...item, children: toggleFolderInTree(item.children, folderId) };
       }
       return item;
   });
};

// --- EXPLORER ITEM COMPONENT ---

const ExplorerTreeItem: React.FC<{
    item: ExplorerItem;
    level: number;
    activeItemId: string | null;
    onSelectItem: (id: string) => void;
    onToggleFolder: (id: string) => void;
    onDelete: (id: string) => void;
    t: any; // Translation function
}> = ({ item, level, activeItemId, onSelectItem, onToggleFolder, onDelete, t }) => {
    
    const indentStyle = { paddingLeft: `${level * 20}px` };
    const isActive = activeItemId === item.id;

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(t.code_editor_delete_confirm.replace('{name}', item.name))) {
            onDelete(item.id);
        }
    };
    
    if (item.type === 'folder') {
        return (
            <>
                <div
                    onClick={() => onSelectItem(item.id)}
                    className={`flex items-center group p-2.5 text-sm cursor-pointer transition-colors rounded-lg m-1 ${isActive ? 'bg-[var(--border-color)] font-semibold text-[var(--accent-color)]' : 'hover:bg-[var(--border-color)]'}`}
                    style={indentStyle}
                >
                    <button onClick={(e) => { e.stopPropagation(); onToggleFolder(item.id) }} className="p-0.5 rounded hover:bg-[var(--panel-bg)]">
                        {item.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </button>
                    <FolderIcon isOpen={item.isOpen} />
                    <span className="truncate flex-grow">{item.name}</span>
                    <button onClick={handleDeleteClick} className="ml-2 p-1 text-red-500/50 hover:text-red-500 rounded flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`${t.code_editor_delete_aria} ${item.name}`}>
                        <TrashIcon />
                    </button>
                </div>
                {item.isOpen && item.children.map(child => (
                    <ExplorerTreeItem
                        key={child.id}
                        item={child}
                        level={level + 1}
                        activeItemId={activeItemId}
                        onSelectItem={onSelectItem}
                        onToggleFolder={onToggleFolder}
                        onDelete={onDelete}
                        t={t}
                    />
                ))}
            </>
        );
    }

    return (
        <div
            onClick={() => onSelectItem(item.id)}
            className={`flex items-center group p-2.5 text-sm cursor-pointer transition-colors rounded-lg m-1 ${isActive ? 'bg-[var(--border-color)] font-semibold text-[var(--accent-color)]' : 'hover:bg-[var(--border-color)]'}`}
            style={indentStyle}
        >
            <div className="w-5 mr-1"></div> {/* Spacer for alignment */}
            <FileIcon />
            <span className="truncate flex-grow">{item.name}</span>
            <button onClick={handleDeleteClick} className="ml-2 p-1 text-red-500/50 hover:text-red-500 rounded flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`${t.code_editor_delete_aria} ${item.name}`}>
                <TrashIcon />
            </button>
        </div>
    );
};


// --- MAIN EDITOR COMPONENT ---

interface CodeEditorProps {
    onBack?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onBack }) => {
    const { t } = useSettings();
    const [items, setItems] = useState<ExplorerItem[]>(initialItems);
    const [activeItemId, setActiveItemId] = useState<string | null>(initialItems[0]?.id || null);
    const [activeView, setActiveView] = useState<'code' | 'preview'>('code');
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const addMenuRef = useRef<HTMLDivElement>(null);

    const activeFile = useMemo(() => {
        if (!activeItemId) return null;
        const item = findItemById(items, activeItemId);
        return item?.type === 'file' ? item : null;
    }, [items, activeItemId]);

    // This effect ensures that if the active item is deleted, it gets deselected.
    useEffect(() => {
        if (activeItemId && !findItemById(items, activeItemId)) {
            setActiveItemId(null);
        }
    }, [items, activeItemId]);

    // Close add menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
                setIsAddMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!activeItemId) return;
        setItems(currentItems => updateFileContentInTree(currentItems, activeItemId, e.target.value));
    }, [activeItemId]);

    const handleCreateItem = useCallback((type: 'file' | 'folder') => {
        setIsAddMenuOpen(false);
        const promptText = type === 'file' ? t.code_editor_new_file_prompt : t.code_editor_new_folder_prompt;
        const name = prompt(promptText);
        if (!name || !name.trim()) return;
    
        const trimmedName = name.trim();
        const newItem: ExplorerItem = type === 'file'
            ? { id: `file-${Date.now()}`, name: trimmedName, type: 'file', content: `/* ${t.code_editor_new_file_content.replace('{name}', trimmedName)} */` }
            : { id: `folder-${Date.now()}`, name: trimmedName, type: 'folder', isOpen: true, children: [] };
        
        setItems(currentItems => {
            const activeItem = activeItemId ? findItemById(currentItems, activeItemId) : null;
            let parentId: string | null = null;
            
            if (activeItem) {
                if (activeItem.type === 'folder') {
                    parentId = activeItem.id;
                } else {
                    parentId = findParentFolderId(currentItems, activeItem.id);
                }
            }
            
            if (parentId) {
                return addItemToTree(currentItems, parentId, newItem);
            }
            return [...currentItems, newItem];
        });
    
        setActiveItemId(newItem.id);
        if (newItem.type === 'file') {
            setActiveView('code');
        }
    }, [activeItemId, t]);

    const handleDeleteItem = useCallback((idToDelete: string) => {
        setItems(currentItems => deleteItemFromTree(currentItems, idToDelete));
    }, []);
    
    const handleToggleFolder = useCallback((folderId: string) => {
        setItems(currentItems => toggleFolderInTree(currentItems, folderId));
    }, []);

    const handleSelectItem = useCallback((itemId: string) => {
        setActiveItemId(itemId);
        const item = findItemById(items, itemId);
        if (item?.type === 'file') {
            setActiveView('code');
        }
    }, [items]);

    return (
        <div className="bg-[var(--panel-bg)] h-full flex flex-col overflow-hidden text-[var(--text-color)] rounded-xl border border-[var(--border-color)]">
            <div className="flex-shrink-0 bg-[var(--bg-color)] p-2 flex items-center border-b border-[var(--border-color)]">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-[var(--panel-bg)] mr-2"
                        aria-label="Back to home"
                    >
                        <BackArrowIcon />
                    </button>
                )}
                <button onClick={() => setActiveView('code')} className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeView === 'code' ? 'bg-[var(--panel-bg)] shadow-sm' : 'hover:bg-[var(--panel-bg)]'}`}>
                    <CodeIcon /> {t.code_editor_code_view}
                </button>
                <button onClick={() => setActiveView('preview')} className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ml-3 ${activeView === 'preview' ? 'bg-[var(--panel-bg)] shadow-sm' : 'hover:bg-[var(--panel-bg)]'}`}>
                    <PreviewIcon /> {t.code_editor_preview_view}
                </button>
            </div>
            <div className="flex flex-grow min-h-0">
                {activeView === 'code' ? (
                    <div className="flex h-full w-full">
                        <div className="w-72 flex flex-col border-r border-[var(--border-color)] flex-shrink-0">
                            <div className="flex items-center justify-between p-3 border-b border-[var(--border-color)]">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-color-light)] ml-2">{t.code_editor_explorer}</h4>
                                <div className="relative" ref={addMenuRef}>
                                    <button onClick={() => setIsAddMenuOpen(prev => !prev)} className="bg-transparent hover:bg-[var(--border-color)] active:scale-95 text-[var(--text-color)] h-10 w-10 flex items-center justify-center rounded-lg" aria-label={t.code_editor_add_aria}>
                                        <PlusIcon />
                                    </button>
                                    {isAddMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg shadow-lg p-1 z-10">
                                            <button onClick={() => handleCreateItem('file')} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--border-color)] flex items-center">
                                                <FileIcon /> {t.code_editor_new_file}
                                            </button>
                                            <button onClick={() => handleCreateItem('folder')} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--border-color)] flex items-center">
                                                <FolderIcon /> {t.code_editor_new_folder}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto py-1">
                                {items.map(item => (
                                    <ExplorerTreeItem
                                        key={item.id}
                                        item={item}
                                        level={0}
                                        activeItemId={activeItemId}
                                        onSelectItem={handleSelectItem}
                                        onToggleFolder={handleToggleFolder}
                                        onDelete={handleDeleteItem}
                                        t={t}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 relative bg-[var(--bg-color)]">
                            <textarea
                                value={activeFile?.content ?? ''}
                                onChange={handleCodeChange}
                                className="w-full h-full p-6 bg-transparent text-[var(--text-color)] font-mono text-base resize-none focus:outline-none absolute inset-0"
                                spellCheck="false"
                                placeholder={activeItemId && !activeFile ? t.code_editor_placeholder_select_file : t.code_editor_placeholder_create_file}
                                disabled={!activeFile}
                            />
                        </div>
                    </div>
                ) : (
                    <iframe
                        srcDoc={activeFile?.content || `<h1 style="font-family: sans-serif; color: #4a5568; text-align: center; padding-top: 2rem;">${t.code_editor_preview_select_file}</h1>`}
                        title="Code Preview"
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full bg-white border-none"
                    />
                )}
            </div>
        </div>
    );
};

export default CodeEditor;