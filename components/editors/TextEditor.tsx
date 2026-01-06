import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

// --- Icons ---
// Back Arrow Icon - arrow-left-sm-svgrepo-com.svg
const BackArrowIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 12H7M7 12L11 16M7 12L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Text Editor Icon - Edit 03 SVG Icon.svg
const TextEditorIcon = () => (
    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 20.0002H21M3 20.0002H4.67454C5.16372 20.0002 5.40832 20.0002 5.63849 19.945C5.84256 19.896 6.03765 19.8152 6.2166 19.7055C6.41843 19.5818 6.59138 19.4089 6.93729 19.063L19.5 6.50023C20.3285 5.6718 20.3285 4.32865 19.5 3.50023C18.6716 2.6718 17.3285 2.6718 16.5 3.50023L3.93726 16.063C3.59136 16.4089 3.4184 16.5818 3.29472 16.7837C3.18506 16.9626 3.10425 17.1577 3.05526 17.3618C3 17.5919 3 17.8365 3 18.3257V20.0002Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Toolbar Icons ---
const BoldIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M6 4V20M9.5 4H15.5C17.7091 4 19.5 5.79086 19.5 8C19.5 10.2091 17.7091 12 15.5 12H9.5H16.5C18.7091 12 20.5 13.7909 20.5 16C20.5 18.2091 18.7091 20 16.5 20H9.5M9.5 4V20M9.5 4H4M9.5 20H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ItalicIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M3,21a1,1,0,0,1,1-1H7.35L14.461,4H12a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2H16.65L9.539,20H12a1,1,0,0,1,0,2H4A1,1,0,0,1,3,21Z"/></svg>;
const UnderlineIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M6 19H18M8 5V11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const UndoIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M7 13L3 9M3 9L7 5M3 9H16C18.7614 9 21 11.2386 21 14C21 16.7614 18.7614 19 16 19H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const RedoIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M17 11L21 15M21 15L17 19M21 15H8C5.23858 15 3 12.7614 3 10C3 7.23858 5.23858 5 8 5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ListBulletIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ListNumberIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M10 17H20M4 15.6853V15.5C4 14.6716 4.67157 14 5.5 14H5.54054C6.34658 14 7.00021 14.6534 7.00021 15.4595C7.00021 15.8103 6.8862 16.1519 6.67568 16.4326L4 20.0002L7 20M10 12H20M10 7H20M4 5L6 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChecklistIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M11 17H20M8 15L5.5 18L4 17M11 12H20M8 10L5.5 13L4 12M11 7H20M8 5L5.5 8L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const TableIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M4 9.5H20M4 14.5H20M9 4.5V19.5M7.2 19.5H16.8C17.9201 19.5 18.4802 19.5 18.908 19.282C19.2843 19.0903 19.5903 18.7843 19.782 18.408C20 17.9802 20 17.4201 20 16.3V7.7C20 6.5799 20 6.01984 19.782 5.59202C19.5903 5.21569 19.2843 4.90973 18.908 4.71799C18.4802 4.5 17.9201 4.5 16.8 4.5H7.2C6.0799 4.5 5.51984 4.5 5.09202 4.71799C4.71569 4.90973 4.40973 5.21569 4.21799 5.59202C4 6.01984 4 6.57989 4 7.7V16.3C4 17.4201 4 17.9802 4.21799 18.408C4.40973 18.7843 4.71569 19.0903 5.09202 19.282C5.51984 19.5 6.07989 19.5 7.2 19.5Z" stroke="currentColor" strokeWidth="2"/></svg>;
const AttachmentIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M14,18H9a6,6,0,0,1-6-6H3A6,6,0,0,1,9,6h8a4,4,0,0,1,4,4h0a4,4,0,0,1-4,4H9a2,2,0,0,1-2-2H7a2,2,0,0,1,2-2h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const FontSizeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M2,21H6a1,1,0,0,0,0-2H5.376l1.951-6h5.346l1.95,6H14a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2H16.727L11.751,3.69A1,1,0,0,0,10.8,3H9.2a1,1,0,0,0-.951.69L3.273,19H2a1,1,0,0,0,0,2ZM9.927,5h.146l1.95,6H7.977ZM23,16a1,1,0,0,1-1,1H19a1,1,0,0,1,0-2h.365l-.586-1.692H17a1,1,0,0,1,0-2h1.087L17.288,9h-.576l-.113.327a1,1,0,0,1-1.891-.654l.346-1A1,1,0,0,1,16,7h2a1,1,0,0,1,.945.673L21.481,15H22A1,1,0,0,1,23,16Z"/></svg>;


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
    const [isChecklist, setIsChecklist] = useState(false);
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
        if (!size || size <= 0 || size > 1000) return; // Allow up to 1000px
        
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
        
        // Check if we're in a checklist (check for checkbox elements)
        currentEl = parent as HTMLElement;
        let inChecklist = false;
        while (currentEl && editorRef.current.contains(currentEl)) {
            if (currentEl.tagName === 'UL' || currentEl.tagName === 'LI') {
                const hasCheckbox = currentEl.querySelector('input[type="checkbox"]') !== null;
                if (hasCheckbox) {
                    inChecklist = true;
                    break;
                }
            }
            if (currentEl === editorRef.current) break;
            currentEl = currentEl.parentElement;
        }
        setIsChecklist(inChecklist);
    }, [theme]);

    const handleInsertChecklist = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const checklistHTML = `
            <ul style="list-style: none; padding-left: 0;">
                <li style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <input type="checkbox" style="margin-right: 0.5rem; cursor: pointer;" />
                    <span contenteditable="true">Checklist item</span>
                </li>
            </ul>
            <p><br></p>
        `;
        document.execCommand('insertHTML', false, checklistHTML);
        editorRef.current?.focus();
        updateToolbarState();
    }, [updateToolbarState]);

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
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg transition-colors text-[var(--text-color-light)] hover:bg-[var(--border-color)] active:scale-95"
                        title="Back to home"
                    >
                        <BackArrowIcon />
                    </button>
                )}
                <div className="flex items-center px-2 text-[var(--text-color)]">
                    <TextEditorIcon />
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
                                    min="1"
                                    max="1000"
                                    step="1"
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
                <ToolbarButton onClick={handleInsertChecklist} isActive={isChecklist} title="Checklist"><ChecklistIcon /></ToolbarButton>

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
