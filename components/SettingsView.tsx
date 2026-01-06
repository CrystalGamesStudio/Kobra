import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Language } from '../lib/translations';

const SettingsView: React.FC = () => {
    const { theme, setTheme, language, setLanguage, t } = useSettings();

    const languageOptions: { value: Language; label: string }[] = [
        { value: 'en', label: 'English' },
        { value: 'pl', label: 'Polski' },
        { value: 'ja', label: '日本語' },
        { value: 'es', label: 'Español' },
    ];

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 text-[var(--text-color)]">
            <h1 className="text-2xl sm:text-3xl font-bold">{t.settings}</h1>
            
            <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t.appearance}</h2>
                <div className="flex items-center space-x-2 bg-[var(--bg-color)] p-2 rounded-lg">
                    <button 
                        onClick={() => setTheme('light')}
                        className={`w-full py-2.5 sm:py-3 rounded-md font-semibold transition-colors text-sm sm:text-base ${theme === 'light' ? 'bg-[var(--panel-bg)] text-[var(--accent-color)] shadow-sm' : 'hover:bg-[var(--panel-bg)]'}`}
                    >
                        {t.light}
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`w-full py-2.5 sm:py-3 rounded-md font-semibold transition-colors text-sm sm:text-base ${theme === 'dark' ? 'bg-[var(--panel-bg)] text-[var(--accent-color)] shadow-sm' : 'hover:bg-[var(--panel-bg)]'}`}
                    >
                        {t.dark}
                    </button>
                </div>
            </div>

            <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t.language}</h2>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] p-3 sm:p-4 appearance-none font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-sm sm:text-base"
                    >
                        {languageOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="font-semibold text-black bg-white">{opt.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 text-[var(--text-color-light)]">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;