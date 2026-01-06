import React from 'react';
import { EditorType } from '../types';
import CodeEditor from './editors/CodeEditor';
import AiChatEditor from './editors/AiChatEditor';
import TextEditor from './editors/TextEditor';
import UniversalEditor from './editors/UniversalEditor';
import { useSettings } from '../contexts/SettingsContext';

interface StreamViewProps {
    editorType: EditorType;
    onBack?: () => void;
}

const StreamView: React.FC<StreamViewProps> = ({ editorType, onBack }) => {
    const { t } = useSettings();

    const renderEditor = (editorType: EditorType) => {
        switch (editorType) {
            case EditorType.Code:
                return <CodeEditor onBack={onBack} />;
            case EditorType.AI:
                return <AiChatEditor onBack={onBack} />;
            case EditorType.Text:
                return <TextEditor onBack={onBack} />;
            case EditorType.Universal:
                return <UniversalEditor onBack={onBack} />;
            default:
                return <div className="h-full bg-[var(--panel-bg)] rounded-lg flex items-center justify-center text-[var(--text-color-light)]">{t.editor_coming_soon_long}</div>;
        }
    };

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col min-w-0 animate-fade-in">
                {renderEditor(editorType)}
            </div>
        </div>
    );
};

export default StreamView;