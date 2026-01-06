import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-color)] p-4">
                    <div className="max-w-2xl w-full bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-xl p-8 shadow-lg">
                        <h1 className="text-2xl font-bold text-[var(--text-color)] mb-4">
                            Coś poszło nie tak
                        </h1>
                        <p className="text-[var(--text-color-light)] mb-4">
                            Wystąpił błąd podczas ładowania aplikacji. Sprawdź konsolę przeglądarki, aby zobaczyć szczegóły.
                        </p>
                        {this.state.error && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-[var(--accent-color)] mb-2">
                                    Szczegóły błędu
                                </summary>
                                <pre className="bg-[var(--input-bg)] p-4 rounded text-sm text-[var(--text-color)] overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="px-4 py-2 bg-[var(--accent-color)] text-white rounded hover:bg-[var(--accent-color-hover)] transition-colors"
                        >
                            Odśwież stronę
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

