import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { signInWithGoogle, signUpWithEmail, signInWithEmail, signInAnonymously } from '../services/authService';

const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.8 110.1 20 244 20c66.2 0 121.3 24.5 163.2 65.5l-69.3 67.8C299.4 121.3 274.5 106 244 106c-79.6 0-144.3 64.7-144.3 144.9s64.7 144.9 144.3 144.9c94.1 0 121.7-65.2 125.7-97.4H244V251.8h243.8c1.3 10.6 2.2 21.6 2.2 34z"></path>
    </svg>
);

const GuestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9a6 6 0 1 1-12 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a9 9 0 0 0-9 9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a9 9 0 0 0-9 9" />
    </svg>
);

const LoginPage: React.FC = () => {
    const { t } = useSettings();
    const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProvider, setLoadingProvider] = useState<'email' | 'google' | 'guest' | null>(null);


    const handleAuthError = (err: unknown) => {
        const authError = err as { code: string };
        console.error("Authentication Error:", authError);
        const errorCode = (authError.code || 'auth/generic-error') as keyof typeof t;
        setError(t[errorCode] || t['auth/generic-error']);
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProvider('email');
        setIsLoading(true);
        setError(null);
        try {
            if (mode === 'signIn') {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
        } catch (err) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
            setLoadingProvider(null);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoadingProvider('google');
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
            setLoadingProvider(null);
        }
    };

    const handleGuestSignIn = async () => {
        setLoadingProvider('guest');
        setIsLoading(true);
        setError(null);
        try {
            await signInAnonymously();
        } catch (err) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
            setLoadingProvider(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-[var(--text-color)]">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold">KOBRA</h1>
                    <p className="text-lg text-[var(--accent-color)] font-mono">Code. Stream. Strike.</p>
                </div>
                <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] p-10 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {mode === 'signIn' ? t.login_page_sign_in_title : t.login_page_sign_up_title}
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 text-sm rounded-lg p-3 mb-4 text-center border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-color-light)]">
                                {t.login_page_email_label}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--input-bg)] h-14 border border-[var(--border-color)] rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--text-color-light)]">
                                {t.login_page_password_label}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--input-bg)] h-14 border border-[var(--border-color)] rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 flex items-center justify-center bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-white font-bold py-3 px-4 rounded-lg active:scale-95 disabled:opacity-50 disabled:cursor-wait transition-colors"
                            >
                                {isLoading && loadingProvider === 'email' ? <div className="inline-loader" /> : (mode === 'signIn' ? t.login_page_sign_in_button : t.login_page_sign_up_button)}
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-[var(--border-color)]"></div>
                        <span className="text-[var(--text-color-light)] text-sm px-4">{t.login_page_or_continue_with}</span>
                        <div className="flex-grow h-px bg-[var(--border-color)]"></div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full h-14 flex items-center justify-center gap-3 bg-[var(--panel-bg)] border border-[var(--border-color)] hover:bg-[var(--border-color)] active:scale-95 font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-wait transition-colors"
                        >
                            {isLoading && loadingProvider === 'google' ? <div className="inline-loader" /> : (
                                <>
                                    <GoogleIcon />
                                    {t.login_page_google_button}
                                </>
                            )}
                        </button>
                         <button
                            onClick={handleGuestSignIn}
                            disabled={isLoading}
                            className="w-full h-14 flex items-center justify-center gap-3 bg-[var(--panel-bg)] border border-[var(--border-color)] hover:bg-[var(--border-color)] active:scale-95 font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-wait transition-colors"
                        >
                            {isLoading && loadingProvider === 'guest' ? <div className="inline-loader" /> : (
                                <>
                                    <GuestIcon />
                                    {t.login_page_guest_button}
                                </>
                            )}
                        </button>
                    </div>


                    <div className="text-center text-sm text-[var(--text-color-light)] mt-6">
                        {mode === 'signIn' ? (
                            <>
                                {t.login_page_to_sign_up_prompt}{' '}
                                <button onClick={() => { setMode('signUp'); setError(null); }} className="font-medium text-[var(--accent-color)] hover:opacity-80">
                                    {t.login_page_to_sign_up_link}
                                </button>
                            </>
                        ) : (
                            <>
                                {t.login_page_to_sign_in_prompt}{' '}
                                <button onClick={() => { setMode('signIn'); setError(null); }} className="font-medium text-[var(--accent-color)] hover:opacity-80">
                                    {t.login_page_to_sign_in_link}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
