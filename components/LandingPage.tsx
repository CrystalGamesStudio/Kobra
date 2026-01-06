import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { signInAnonymously } from '../services/authService';

interface LandingPageProps {
    onNavigateToLogin: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, children: string }> = ({ icon, title, children }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 transition-all hover:border-green-500 hover:bg-gray-800/80 hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/20 text-green-400 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </div>
);

const UserProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
        <path d="M4 26.016q0 2.496 1.76 4.224t4.256 1.76h12q2.464 0 4.224-1.76t1.76-4.224q-0.448-2.688-2.112-4.928t-4.096-3.552q2.208-2.368 2.208-5.536v-4q0-3.296-2.336-5.632t-5.664-2.368-5.664 2.368-2.336 5.632v4q0 3.168 2.208 5.536-2.4 1.344-4.064 3.552t-2.144 4.928zM8 26.016q0.672-2.592 2.944-4.288t5.056-1.728 5.056 1.728 2.944 4.288q0 0.832-0.576 1.408t-1.408 0.576h-12q-0.832 0-1.44-0.576t-0.576-1.408zM12 12v-4q0-1.632 1.184-2.816t2.816-1.184 2.816 1.184 1.184 2.816v4q0 1.664-1.184 2.848t-2.816 1.152-2.816-1.152-1.184-2.848z"/>
    </svg>
);


const Section: React.FC<{title: string, subtitle: string, children: React.ReactNode, className?: string}> = ({ title, subtitle, children, className = '' }) => (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 ${className}`}>
        <div className="text-center mb-12">
            <h3 className="text-4xl font-bold tracking-tight">{title}</h3>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        {children}
    </div>
);

const WhatsNewItem: React.FC<{
    date: string;
    title: string;
    description: string;
    tag: string;
    tagColor: string;
    locale: string;
}> = ({ date, title, description, tag, tagColor, locale }) => {
    const formattedDate = new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex-shrink-0 text-sm text-gray-400 font-medium w-full sm:w-36 text-left sm:text-right">{formattedDate}</div>
            <div className="relative pl-8 sm:pl-0">
                 <div className="absolute left-0 sm:-left-4 h-full w-px bg-gray-700">
                    <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-gray-700 border-2 border-gray-900"></div>
                </div>
                <div>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${tagColor}`}>
                        {tag}
                    </span>
                    <h4 className="font-bold text-white text-lg mb-1">{title}</h4>
                    <p className="text-gray-400">{description}</p>
                </div>
            </div>
        </div>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
    const { t, language } = useSettings();

    const handleGuestSignIn = async () => {
        try {
            await signInAnonymously();
        } catch (error) {
            console.error("Guest sign-in failed", error);
            alert('Guest sign-in failed. Please try again.');
        }
    };

    const changelogItems = [
        { id: 1, tagKey: 'whats_new_1_tag_key', color: 'bg-blue-500/20 text-blue-300' },
        { id: 2, tagKey: 'whats_new_2_tag_key', color: 'bg-purple-500/20 text-purple-300' },
        { id: 3, tagKey: 'whats_new_3_tag_key', color: 'bg-blue-500/20 text-blue-300' },
        { id: 4, tagKey: 'whats_new_4_tag_key', color: 'bg-green-500/20 text-green-300' },
    ];


    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="absolute inset-0 bg-grid-gray-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
            
            <header className="sticky top-0 z-20 w-full px-4 sm:px-6 lg:px-8 pt-4">
                <div className="max-w-7xl mx-auto bg-gray-800/80 border border-gray-700 rounded-xl shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between h-14 px-4 sm:px-6">
                        <div className="flex items-baseline space-x-4 flex-shrink-0">
                            <h1 className="text-3xl font-bold text-white">KOBRA</h1>
                            <p className="text-sm text-green-400 font-mono hidden md:block">Code. Stream. Strike.</p>
                        </div>
                        
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="https://crystalgames.studio" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium">WEB</a>
                            <a href="https://crystalgames.studio/#/game-guide" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium">{t.landing_docs}</a>
                            <a href="https://x.com/CrystalStudio64" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium">{t.landing_community}</a>
                            <a href="https://crystalgames.studio/#/contact" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium">{t.landing_feedback}</a>
                        </nav>

                        <div className="flex items-center flex-shrink-0 space-x-2">
                            <button
                                onClick={handleGuestSignIn}
                                className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white font-semibold p-2 rounded-lg transition-colors"
                                title={t.login_page_guest_button}
                            >
                                <UserProfileIcon />
                            </button>
                            <button 
                                onClick={onNavigateToLogin}
                                className="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                {t.landing_sign_in}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
                    <div className="bg-green-500/20 text-green-300 text-sm font-medium px-4 py-1 rounded-full inline-block mb-4 border border-green-500/30">
                        {t.landing_tagline}
                    </div>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        {t.landing_title}
                    </h2>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                        {t.landing_subtitle}
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={onNavigateToLogin} 
                            className="bg-green-500 text-gray-900 font-bold text-lg py-3 px-8 rounded-lg transition-transform hover:scale-105 shadow-2xl shadow-green-500/20"
                        >
                            {t.landing_cta}
                        </button>
                    </div>
                </div>

                <Section title={t.landing_features_title} subtitle={t.landing_features_subtitle}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                            title={t.landing_feature_code_title}
                        >
                            {t.landing_feature_code_desc}
                        </FeatureCard>
                        <FeatureCard 
                           icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.9 4.8-4.8 1.9 4.8 1.9L12 21l1.9-4.8 4.8-1.9-4.8-1.9L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>}
                            title={t.landing_feature_ai_title}
                        >
                            {t.landing_feature_ai_desc}
                        </FeatureCard>
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>}
                            title={t.landing_feature_text_title}
                        >
                            {t.landing_feature_text_desc}
                        </FeatureCard>
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 4v4" /><path d="M10 4v4" /></svg>}
                            title={t.landing_feature_universal_title}
                        >
                            {t.landing_feature_universal_desc}
                        </FeatureCard>
                    </div>
                </Section>
                
                <Section title={t.landing_how_it_works_title} subtitle={t.landing_how_it_works_subtitle}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                            <h3 className="text-2xl font-bold text-green-400 mb-2">{t.landing_step1_title}</h3>
                            <p className="text-gray-400">{t.landing_step1_desc}</p>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                            <h3 className="text-2xl font-bold text-green-400 mb-2">{t.landing_step2_title}</h3>
                            <p className="text-gray-400">{t.landing_step2_desc}</p>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                            <h3 className="text-2xl font-bold text-green-400 mb-2">{t.landing_step3_title}</h3>
                            <p className="text-gray-400">{t.landing_step3_desc}</p>
                        </div>
                    </div>
                </Section>

                <Section title={t.landing_whats_new_title} subtitle={t.landing_whats_new_subtitle} className="bg-gray-800/50">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {changelogItems.map((item) => (
                             <WhatsNewItem
                                key={item.id}
                                date={t[`whats_new_${item.id}_date` as keyof typeof t] as string}
                                title={t[`whats_new_${item.id}_title` as keyof typeof t] as string}
                                description={t[`whats_new_${item.id}_desc` as keyof typeof t] as string}
                                tag={t[t[`whats_new_${item.id}_tag_key` as keyof typeof t] as keyof typeof t] as string}
                                tagColor={item.color}
                                locale={language}
                            />
                        ))}
                    </div>
                </Section>

            </main>
            
            <footer className="text-center py-8 text-gray-500">
                <p>&copy; {new Date().getFullYear()} Kobra. {t.landing_footer_rights}</p>
            </footer>
        </div>
    );
};

export default LandingPage;