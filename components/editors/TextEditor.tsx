import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

// --- Toolbar Icons ---
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>;
const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>;
const UnderlineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" x2="20" y1="21" y2="21" /></svg>;
const UndoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>;
const ListNumberIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>;
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="3" y2="21" /><line x1="15" x2="15" y1="3" y2="21" /></svg>;
const AttachmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>;
const FontSizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 20h4l10-10-4-4L4 16v4" /><path d="m14.5 5.5 4 4" /></svg>;


const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void, isActive: boolean, children: React.ReactNode, buttonRef?: React.Ref<HTMLButtonElement>, title: string }> = ({ onClick, isActive, children, buttonRef, title }) => (
    <button
        ref={buttonRef}
        type="button"
        onMouseDown={onClick} 
        className={`p-2 rounded-lg transition-colors h-10 w-10 flex items-center justify-center ${isActive ? 'bg-[var(--border-color)] text-[var(--accent-color)]' : 'text-[var(--text-color-light)] hover:bg-[var(--border-color)] active:scale-95'}`}
        title={title}
    >
        {children}
    </button>
);

const ColorPickerButton: React.FC<{ color: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, title: string }> = ({ color, onChange, title }) => (
    <div className="relative flex items-center justify-center p-2 rounded-lg hover:bg-[var(--border-color)] cursor-pointer h-10 w-10" title={title}>
        <div className="w-5 h-5 rounded-full border border-[var(--border-color)]" style={{ backgroundColor: color }} />
        <input
            type="color"
            value={color}
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Change text color"
            onMouseDown={e => e.preventDefault()}
        />
    </div>
);


interface TextEditorProps {
    onBack?: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onBack }) => {
    const { t, theme } = useSettings();
    const editorRef = useRef<HTMLDivElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isUL, setIsUL] = useState(false);
    const [isOL, setIsOL] = useState(false);
    const [textColor, setTextColor] = useState(theme === 'dark' ? '#e2e8f0' : '#1a202c');
    const [fontSize, setFontSize] = useState(16);
    const [fontSizeInput, setFontSizeInput] = useState<string>('16');
    
    // Popover states
    const [isTablePopoverOpen, setIsTablePopoverOpen] = useState(false);
    const [isFontSizePopoverOpen, setIsFontSizePopoverOpen] = useState(false);

    // Popover-specific data states
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);

    // Popover refs
    const tablePopoverRef = useRef<HTMLDivElement>(null);
    const tableButtonRef = useRef<HTMLButtonElement>(null);
    const fontSizePopoverRef = useRef<HTMLDivElement>(null);
    const fontSizeButtonRef = useRef<HTMLButtonElement>(null);


    // Close popovers on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isTablePopoverOpen && tablePopoverRef.current && !tablePopoverRef.current.contains(event.target as Node) && !tableButtonRef.current?.contains(event.target as Node)) {
                setIsTablePopoverOpen(false);
            }
            if (isFontSizePopoverOpen && fontSizePopoverRef.current && !fontSizePopoverRef.current.contains(event.target as Node) && !fontSizeButtonRef.current?.contains(event.target as Node)) {
                setIsFontSizePopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTablePopoverOpen, isFontSizePopoverOpen]);
    

    const applyCommand = useCallback((e: React.MouseEvent | React.ChangeEvent<HTMLSelectElement>, command: string, value?: string) => {
        e.preventDefault();
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateToolbarState();
    }, []);

    const handleUndo = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        document.execCommand('undo', false);
        editorRef.current?.focus();
        updateToolbarState();
    }, []);
    
    const handleRedo = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        document.execCommand('redo', false);
        editorRef.current?.focus();
        updateToolbarState();
    }, []);

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        document.execCommand('foreColor', false, e.target.value);
        setTextColor(e.target.value);
    }, []);

    const handleInsertAttachment = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        attachmentInputRef.current?.click();
    }, []);

    const formatBytes = (bytes: number, decimals = 2): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const FileBlockIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" style="height: 1.5rem; width: 1.5rem; margin-right: 0.75rem; color: var(--text-color-light); flex-shrink: 0;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;

    const insertAttachmentBlock = (file: File) => {
        const fileName = file.name;
        const fileSize = formatBytes(file.size);

        const attachmentHTML = `
            <div contenteditable="false" style="display: flex; align-items: center; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.75rem 1rem; margin: 0.5rem 0; cursor: default; user-select: none;">
                ${FileBlockIcon()}
                <div style="flex-grow: 1; overflow: hidden;">
                    <p style="margin: 0; font-weight: 500; color: var(--text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.875rem;">${fileName}</p>
                    <p style="margin: 0; font-size: 0.75rem; color: var(--text-color-light);">${fileSize}</p>
                </div>
            </div>
            <p><br></p>
        `;
        
        document.execCommand('insertHTML', false, attachmentHTML);
        editorRef.current?.focus();
    };
    
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            insertAttachmentBlock(file);
        }
        e.target.value = ''; // Reset input to allow selecting the same file again
    }, []);
    
    const handleTableButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsTablePopoverOpen(prev => !prev);
    };

    const handleInsertTable = (e: React.MouseEvent) => {
        e.preventDefault();
        const rows = tableRows;
        const cols = tableCols;

        if (rows > 0 && cols > 0 && rows <= 20 && cols <= 20) {
            let tableHTML = '<table style="border-collapse: collapse; width: 100%;">';
            for (let i = 0; i < rows; i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHTML += '<td style="border: 1px solid var(--border-color); padding: 8px;"><br></td>';
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</table><p><br></p>'; // Add paragraph after for easier editing
            document.execCommand('insertHTML', false, tableHTML);
            setIsTablePopoverOpen(false);
        } else {
            console.error('Invalid table dimensions');
        }
        editorRef.current?.focus();
    };

    const handleFontSizeButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isFontSizePopoverOpen) {
            setFontSizeInput(fontSize ? fontSize.toString() : '16');
        }
        setIsFontSizePopoverOpen(prev => !prev);
    };

    const handleApplyFontSize = (e: React.MouseEvent) => {
        e.preventDefault();
        const size = parseInt(fontSizeInput, 10);
        if (!size || size <= 0) return;
        
        setIsFontSizePopoverOpen(false);
    
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        
        try {
            range.surroundContents(span);
        } catch (ex) {
            document.execCommand("insertHTML", false, `<span style="font-size:${size}px;">${selection.toString()}</span>`);
            console.warn("Used insertHTML as a fallback for applying font size. Formatting may have been lost.", ex);
        }
    
        editorRef.current?.focus();
        updateToolbarState();
    };

    const rgbToHex = (rgbString: string): string => {
        const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return theme === 'dark' ? '#e2e8f0' : '#1a202c';
        const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
        return `#${toHex(Number(match[1]))}${toHex(Number(match[2]))}${toHex(Number(match[3]))}`;
    };

    const updateToolbarState = useCallback(() => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (!editorRef.current.contains(range.commonAncestorContainer)) {
            return;
        }

        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));
        setIsUL(document.queryCommandState('insertUnorderedList'));
        setIsOL(document.queryCommandState('insertOrderedList'));

        const color = document.queryCommandValue('foreColor');
        setTextColor(color ? rgbToHex(color) : (theme === 'dark' ? '#e2e8f0' : '#1a202c'));

        let parent: Node | null = range.commonAncestorContainer;
        if (parent.nodeType === Node.TEXT_NODE) {
            parent = parent.parentNode;
        }
        
        if (!parent || !(parent instanceof HTMLElement)) {
            setFontSize(16); // Fallback for safety
            return;
        }
        
        let finalSize: number = 16; // Default fallback

        const computedSize = parseInt(window.getComputedStyle(parent).fontSize, 10);
        if (!isNaN(computedSize) && computedSize > 0) {
            finalSize = computedSize;
        }

        let currentEl: HTMLElement | null = parent;
        while (currentEl && editorRef.current.contains(currentEl)) {
            if (currentEl.style.fontSize) {
                const inlineSize = parseInt(currentEl.style.fontSize, 10);
                if (!isNaN(inlineSize) && inlineSize > 0) {
                    finalSize = inlineSize; 
                    break;
                }
            }
            if (currentEl === editorRef.current) break;
            currentEl = currentEl.parentElement;
        }
        
        setFontSize(finalSize);
    }, [theme]);

    useEffect(() => {
        const handleSelectionChange = () => {
            if (document.activeElement === editorRef.current) {
                updateToolbarState();
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, [updateToolbarState]);
    
    return (
        <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] h-full flex flex-col overflow-hidden rounded-xl">
            <div className="flex-shrink-0 bg-[var(--bg-color)] p-3 flex items-center space-x-1 flex-wrap border-b border-[var(--border-color)]">
                 <div className="flex items-center px-2 text-[var(--text-color)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 13H8" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 17H8" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9H8" />
                    </svg>
                    <h3 className="font-bold text-sm">{t.text_editor_title}</h3>
                </div>
                
                <div className="w-px h-7 bg-[var(--border-color)] mx-2"></div>

                <ToolbarButton onClick={(e) => applyCommand(e, 'bold')} isActive={isBold} title={t.text_editor_bold}><BoldIcon /></ToolbarButton>
                <ToolbarButton onClick={(e) => applyCommand(e, 'italic')} isActive={isItalic} title={t.text_editor_italic}><ItalicIcon /></ToolbarButton>
                <ToolbarButton onClick={(e) => applyCommand(e, 'underline')} isActive={isUnderline} title={t.text_editor_underline}><UnderlineIcon /></ToolbarButton>
                <ColorPickerButton color={textColor} onChange={handleColorChange} title={t.text_editor_color}/>
                <div className="relative">
                    <button
                        ref={fontSizeButtonRef}
                        type="button"
                        onMouseDown={handleFontSizeButtonClick}
                        className="p-2 rounded-lg transition-colors flex items-center space-x-1 h-10 text-[var(--text-color-light)] hover:bg-[var(--border-color)]"
                        title={t.text_editor_font_size}
                    >
                        <FontSizeIcon />
                        <span className="text-xs font-mono w-6 text-right">{fontSize ? Math.round(fontSize) : ''}</span>
                    </button>
                    {isFontSizePopoverOpen && (
                        <div ref={fontSizePopoverRef} className="absolute top-full mt-2 left-0 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg shadow-lg p-3 z-10 w-48">
                            <h4 className="font-semibold text-sm mb-2">{t.text_editor_font_size_px}</h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    value={fontSizeInput}
                                    onChange={(e) => setFontSizeInput(e.target.value)}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md p-1 text-center"
                                />
                                <button
                                    onClick={handleApplyFontSize}
                                    className="flex-shrink-0 bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] active:scale-95 text-white font-bold py-1 px-3 rounded-md transition-colors"
                                >
                                    {t.text_editor_apply}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="w-px h-7 bg-[var(--border-color)] mx-2"></div>

                <ToolbarButton onClick={(e) => applyCommand(e, 'insertUnorderedList')} isActive={isUL} title={t.text_editor_bullet_list}><ListBulletIcon /></ToolbarButton>
                <ToolbarButton onClick={(e) => applyCommand(e, 'insertOrderedList')} isActive={isOL} title={t.text_editor_numbered_list}><ListNumberIcon /></ToolbarButton>

                <div className="w-px h-7 bg-[var(--border-color)] mx-2"></div>

                <div className="relative">
                    <ToolbarButton onClick={handleTableButtonClick} isActive={isTablePopoverOpen} buttonRef={tableButtonRef} title={t.text_editor_table}><TableIcon /></ToolbarButton>
                     {isTablePopoverOpen && (
                        <div ref={tablePopoverRef} className="absolute top-full mt-2 left-0 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-lg shadow-lg p-4 z-10 w-60">
                            <h4 className="font-semibold text-sm mb-3">{t.text_editor_insert_table}</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="rows" className="text-[var(--text-color-light)] text-sm">{t.text_editor_rows}</label>
                                    <input
                                        type="number"
                                        id="rows"
                                        value={tableRows}
                                        onChange={(e) => setTableRows(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                                        className="w-20 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md p-1 text-center"
                                        min="1" max="20"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="cols" className="text-[var(--text-color-light)] text-sm">{t.text_editor_columns}</label>
                                    <input
                                        type="number"
                                        id="cols"
                                        value={tableCols}
                                        onChange={(e) => setTableCols(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                                        className="w-20 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-md p-1 text-center"
                                        min="1" max="20"
                                    />
                                </div>
                                <button
                                    onClick={handleInsertTable}
                                    className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] active:scale-95 text-white font-bold py-2 rounded-md transition-colors"
                                >
                                    {t.text_editor_insert}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <ToolbarButton onClick={handleInsertAttachment} isActive={false} title={t.text_editor_attachment}><AttachmentIcon /></ToolbarButton>
                
                <div className="w-px h-7 bg-[var(--border-color)] mx-2"></div>

                <ToolbarButton onClick={handleUndo} isActive={false} title={t.text_editor_undo}><UndoIcon /></ToolbarButton>
                <ToolbarButton onClick={handleRedo} isActive={false} title={t.text_editor_redo}><RedoIcon /></ToolbarButton>

            </div>
            
            <input type="file" ref={attachmentInputRef} onChange={handleFileSelect} className="hidden" />

            <div className="flex-grow overflow-y-auto p-2">
                 <div
                    ref={editorRef}
                    contentEditable
                    onMouseUp={updateToolbarState}
                    onKeyUp={updateToolbarState}
                    onFocus={updateToolbarState}
                    className="w-full h-full focus:outline-none bg-[var(--bg-color)] rounded-lg p-8 prose prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl"
                    style={{ 
                        '--tw-prose-body': 'var(--text-color)',
                        '--tw-prose-headings': 'var(--text-color)',
                        '--tw-prose-lead': 'var(--text-color-light)',
                        '--tw-prose-links': 'var(--accent-color)',
                        '--tw-prose-bold': 'var(--text-color)',
                        '--tw-prose-counters': 'var(--text-color-light)',
                        '--tw-prose-bullets': 'var(--accent-color)',
                        '--tw-prose-hr': 'var(--border-color)',
                        '--tw-prose-quotes': 'var(--text-color)',
                        '--tw-prose-quote-borders': 'var(--accent-color)',
                        '--tw-prose-captions': 'var(--text-color-light)',
                        '--tw-prose-code': 'var(--text-color)',
                        '--tw-prose-pre-code': 'var(--text-color)',
                        '--tw-prose-pre-bg': 'transparent',
                        '--tw-prose-th-borders': 'var(--border-color)',
                        '--tw-prose-td-borders': 'var(--border-color)',
                     } as React.CSSProperties}
                >
                </div>
            </div>
        </div>
    );
};

export default TextEditor;
