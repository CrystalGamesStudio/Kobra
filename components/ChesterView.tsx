import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getAiResponse } from '../services/geminiService';
import { useSettings } from '../contexts/SettingsContext';

const SendIcon = () => (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0004 18.5816V12.5M12.7976 18.754L15.8103 19.7625C17.4511 20.3118 18.2714 20.5864 18.7773 20.3893C19.2166 20.2182 19.5499 19.8505 19.6771 19.3965C19.8236 18.8737 19.4699 18.0843 18.7624 16.5053L14.2198 6.36709C13.5279 4.82299 13.182 4.05094 12.7001 3.81172C12.2814 3.60388 11.7898 3.60309 11.3705 3.80958C10.8878 4.04726 10.5394 4.8182 9.84259 6.36006L5.25633 16.5082C4.54325 18.086 4.18671 18.875 4.33169 19.3983C4.4576 19.8528 4.78992 20.2216 5.22888 20.394C5.73435 20.5926 6.55603 20.3198 8.19939 19.7744L11.2797 18.752C11.5614 18.6585 11.7023 18.6117 11.8464 18.5933C11.9742 18.5769 12.1036 18.5771 12.2314 18.5938C12.3754 18.6126 12.5162 18.6597 12.7976 18.754Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const ChatCircleIcon = ({ className = "h-10 w-10" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.50977 19.8018C8.83126 20.5639 10.3645 21 11.9996 21C16.9702 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6351 3.43604 15.1684 4.19819 16.4899L4.20114 16.495C4.27448 16.6221 4.31146 16.6863 4.32821 16.7469C4.34401 16.804 4.34842 16.8554 4.34437 16.9146C4.34003 16.9781 4.3186 17.044 4.27468 17.1758L3.50586 19.4823L3.50489 19.4853C3.34268 19.9719 3.26157 20.2152 3.31938 20.3774C3.36979 20.5187 3.48169 20.6303 3.62305 20.6807C3.78482 20.7384 4.02705 20.6577 4.51155 20.4962L4.51758 20.4939L6.82405 19.7251C6.95537 19.6813 7.02214 19.6591 7.08559 19.6548C7.14475 19.6507 7.19578 19.6561 7.25293 19.6719C7.31368 19.6887 7.37783 19.7257 7.50563 19.7994L7.50977 19.8018Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const ChesterView: React.FC = () => {
    const { t } = useSettings();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);

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

        const messageId = Date.now().toString();
        const userMessage: ChatMessage = { id: messageId, sender: 'user', text: input };
        const messageText = input;
        setInput('');
        
        // Calculate distance from input to message position
        const inputRect = inputRef.current?.getBoundingClientRect();
        const containerRect = messagesContainerRef.current?.getBoundingClientRect();
        
        let startY = 200; // default fallback
        if (inputRect && containerRect) {
            // Calculate how far up the message needs to travel
            const inputBottom = inputRect.bottom;
            const containerTop = containerRect.top;
            const scrollTop = messagesContainerRef.current?.scrollTop || 0;
            // Estimate message position (at bottom of messages container)
            const messageTop = containerRect.bottom - 100; // approximate message position
            startY = inputBottom - messageTop + scrollTop;
        }
        
        // Start animation
        setAnimatingMessageId(messageId);
        
        // Add message with animation
        setMessages(prev => [...prev, userMessage]);
        
        // Scroll to bottom after a brief delay to allow animation
        setTimeout(() => {
            scrollToBottom();
        }, 50);
        
        // After animation completes, remove animation class
        setTimeout(() => {
            setAnimatingMessageId(null);
        }, 600);
        
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
            <div className="p-3 sm:p-4 md:p-5 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 flex-shrink-0 flex items-center justify-center text-[var(--accent-color)]">
                        <ChatCircleIcon className="w-full h-full" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg truncate">{t.chester_name}</h3>
                </div>
                 {messages.length > 0 && (
                    <button onClick={handleClearChat} className="bg-transparent hover:bg-[var(--border-color)] h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-lg text-[var(--text-color-light)] hover:text-red-500 active:scale-95 transition-colors flex-shrink-0 ml-2" title={t.chester_clear_chat_button}>
                        <ClearIcon />
                    </button>
                )}
            </div>

            <div ref={messagesContainerRef} className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-3 sm:space-y-4 relative">
                {messages.length === 0 && (
                    <div className="text-center text-sm sm:text-base text-[var(--text-color-light)] pt-6 sm:pt-10 px-4">{t.chester_prompt_placeholder}</div>
                )}
                {messages.map((msg) => {
                    const isAnimating = animatingMessageId === msg.id && msg.sender === 'user';
                    const inputRect = inputRef.current?.getBoundingClientRect();
                    const containerRect = messagesContainerRef.current?.getBoundingClientRect();
                    
                    let startY = 200;
                    if (isAnimating && inputRect && containerRect) {
                        const inputBottom = inputRect.bottom;
                        const containerTop = containerRect.top;
                        const scrollTop = messagesContainerRef.current?.scrollTop || 0;
                        const messageTop = containerRect.bottom - 100;
                        startY = Math.max(50, inputBottom - messageTop + scrollTop);
                    }
                    
                    return (
                        <div 
                            key={msg.id} 
                            className={`flex items-start gap-2 sm:gap-3 md:gap-4 ${msg.sender === 'user' ? 'justify-end' : ''} ${isAnimating ? 'animate-message-fly-up' : msg.sender === 'user' ? '' : 'animate-fade-in'}`}
                            style={isAnimating ? {
                                position: 'relative',
                                zIndex: 1000,
                                '--message-start-y': `${startY}px`
                            } as React.CSSProperties & { '--message-start-y': string } : undefined}
                        >
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[var(--accent-color)]">
                                    <ChatCircleIcon className="w-full h-full" />
                                </div>
                            )}
                            <div className={`max-w-[85%] sm:max-w-md lg:max-w-xl p-3 sm:p-4 rounded-lg ${msg.sender === 'user' ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-color)]'}`}>
                               <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                        </div>
                    );
                })}
                 {isLoading && (
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4 animate-fade-in">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-[var(--accent-color)]">
                            <ChatCircleIcon className="w-full h-full" />
                        </div>
                        <div className="max-w-lg p-3 sm:p-4 rounded-lg bg-[var(--bg-color)] flex items-center justify-center">
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

            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 md:p-5">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.chester_input_placeholder}
                    disabled={isLoading}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-color)] rounded-lg p-3 sm:p-4 text-sm sm:text-base md:text-lg transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white rounded-lg p-2.5 sm:p-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center transition-colors">
                     <SendIcon />
                </button>
            </form>
        </div>
    );
};

export default ChesterView;
