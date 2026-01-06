import React from 'react';
import { EditorType } from './types';

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const AiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
       <path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9L12 21l1.9-4.8 4.8-1.9-4.8-1.9L12 3z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M19 17v4" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h4" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M17 19h4" />
    </svg>
);

const TextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 13H8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 17H8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9H8" />
    </svg>
);

const UniversalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v11" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 17 5 3-5 3v-6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h.01" />
    </svg>
);


export const EDITORS = [
    { type: EditorType.Code, nameKey: 'editor_code_name', icon: <CodeIcon />, descriptionKey: 'editor_code_description', enabled: true },
    { type: EditorType.AI, nameKey: 'editor_ai_name', icon: <AiIcon />, descriptionKey: 'editor_ai_description', enabled: true },
    { type: EditorType.Text, nameKey: 'editor_text_name', icon: <TextIcon />, descriptionKey: 'editor_text_description', enabled: true },
    { type: EditorType.Universal, nameKey: 'editor_universal_name', icon: <UniversalIcon />, descriptionKey: 'editor_universal_description', enabled: true },
];
