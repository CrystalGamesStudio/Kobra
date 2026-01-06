import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { translations, Language } from '../lib/translations';

type Theme = 'light' | 'dark';

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    language: Language;
    setLanguage: (language: Language) => void;
    t: (typeof translations)[Language];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const html = window.document.documentElement;
        
        html.classList.remove('light', 'dark');
        html.classList.add(theme);

    }, [theme]);

    const t = useMemo(() => translations[language], [language]);

    return (
        <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};