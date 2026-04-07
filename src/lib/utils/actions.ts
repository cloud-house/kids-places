export type ActionResponse<T = unknown> = {
    success: boolean;
    error?: string;
    data?: T;
    message?: string;
    status?: number;
};

export const MESSAGES = {
    pl: {
        unauthorized: 'Musisz być zalogowany',
        forbidden: 'Nie masz uprawnień do wykonania tej akcji',
        notFound: 'Nie znaleziono elementu',
        genericError: 'Wystąpił nieoczekiwany błąd',
        success: 'Operacja zakończona sukcesem',
    },
    en: {
        unauthorized: 'You must be logged in',
        forbidden: 'You do not have permission to perform this action',
        notFound: 'Item not found',
        genericError: 'An unexpected error occurred',
        success: 'Operation completed successfully',
    },
    de: {
        unauthorized: 'Sie müssen angemeldet sein',
        forbidden: 'Sie haben keine Berechtigung, diese Aktion auszuführen',
        notFound: 'Element nicht gefunden',
        genericError: 'Ein unerwarteter Fehler ist aufgetreten',
        success: 'Vorgang erfolgreich abgeschlossen',
    }
};

export function handleActionError<T = unknown>(error: unknown, locale: 'pl' | 'en' | 'de' = 'pl'): ActionResponse<T> {
    console.error('Action Error:', error);
    const message = error instanceof Error ? error.message : MESSAGES[locale].genericError;
    return { success: false, error: message };
}
