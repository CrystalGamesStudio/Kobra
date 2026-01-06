import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import ErrorBoundary from './components/ErrorBoundary';

console.log('Starting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

// Add global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

try {
    console.log('Initializing Firebase...');
    // Import Firebase config early to catch initialization errors
    import('./firebase/config').then(() => {
        console.log('Firebase initialized successfully');
    }).catch((error) => {
        console.error('Firebase initialization error:', error);
    });

    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    console.log('Rendering application...');
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <SettingsProvider>
                    <App />
                </SettingsProvider>
            </ErrorBoundary>
        </React.StrictMode>
    );
    console.log('Application rendered successfully');
} catch (error) {
    console.error('Fatal error during app initialization:', error);
    rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
            <h1>Błąd inicjalizacji aplikacji</h1>
            <p>Wystąpił błąd podczas uruchamiania aplikacji. Sprawdź konsolę przeglądarki (F12) aby zobaczyć szczegóły.</p>
            <pre style="background: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto;">${error instanceof Error ? error.stack : String(error)}</pre>
        </div>
    `;
}