import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getAiResponse } from '../services/geminiService';
import { useSettings } from '../contexts/SettingsContext';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 2-7 20-4-9-9-4 20-7z" />
    </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);


const ChesterView: React.FC = () => {
    const { t } = useSettings();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleClearChat = () => {
        if (window.confirm(t.chester_clear_chat_confirm)) {
            setMessages([]);
        }
    };

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const history = messages
            .map(msg => {
                if (msg.sender === 'user') {
                    return { role: 'user' as const, parts: [{ text: msg.text }] };
                }
                if (msg.sender === 'ai') {
                    return { role: 'model' as const, parts: [{ text: msg.text }] };
                }
                return null;
            })
            .filter((h): h is NonNullable<typeof h> => h !== null);
        
        try {
            const aiResponseText = await getAiResponse(input, history);
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: t.chester_error };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, t]);
    
    return (
        <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] h-full flex flex-col text-[var(--text-color)] rounded-xl">
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center">
                    <img src="https://api.dicebear.com/8.x/bottts/svg?seed=Chester" alt="Chester" className="w-12 h-12 rounded-full mr-4 border-2 border-[var(--accent-color)] p-0.5"/>
                    <div>
                        <h3 className="font-bold text-lg">{t.chester_name}</h3>
                        <p className="text-sm text-[var(--accent-color)]">{t.chester_subtitle_panel}</p>
                    </div>
                </div>
                 {messages.length > 0 && (
                    <button onClick={handleClearChat} className="bg-transparent hover:bg-[var(--border-color)] h-12 w-12 flex items-center justify-center rounded-lg text-[var(--text-color-light)] hover:text-red-500 active:scale-95 transition-colors" title={t.chester_clear_chat_button}>
                        <ClearIcon />
                    </button>
                )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-[var(--text-color-light)] pt-10">{t.chester_prompt_placeholder}</div>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-4 animate-fade-in ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && <img src="https://api.dicebear.com/8.x/bottts/svg?seed=Chester" alt="Chester" className="w-10 h-10 rounded-full flex-shrink-0" />}
                        <div className={`max-w-md lg:max-w-xl p-4 rounded-lg ${msg.sender === 'user' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-color)]'}`}>
                           <p className="text-base whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-4 animate-fade-in">
                        <img src="https://api.dicebear.com/8.x/bottts/svg?seed=Chester" alt="Chester" className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="max-w-lg p-4 rounded-lg bg-[var(--bg-color)] flex items-center justify-center">
                            <div className="loader chat-loader">
                              <div className="box1"></div>
                              <div className="box2"></div>
                              <div className="box3"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-5 border-t border-[var(--border-color)]">
                 <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.chester_input_placeholder}
                        disabled={isLoading}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-lg p-4 text-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0 h-14 w-14 flex items-center justify-center transition-colors">
                         <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChesterView;
