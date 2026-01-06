import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

// --- ICONS ---

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const PreviewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 11v6" />
    </svg>
);

const FolderIcon = ({ isOpen }: { isOpen?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v1" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        )}
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 16-1.5-2 1.5-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 12 1.5 2-1.5 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.5v3" />
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

const CodeEditor: React.FC = () => {
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
                <button onClick={() => setActiveView('code')} className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeView === 'code' ? 'bg-[var(--panel-bg)] shadow-sm' : 'hover:bg-[var(--panel-bg)]'}`}>
                    <CodeIcon /> {t.code_editor_code_view}
                </button>
                <button onClick={() => setActiveView('preview')} className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeView === 'preview' ? 'bg-[var(--panel-bg)] shadow-sm' : 'hover:bg-[var(--panel-bg)]'}`}>
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