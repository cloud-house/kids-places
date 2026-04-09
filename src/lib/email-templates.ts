import { BRAND_CONFIG } from './config'

export type EmailTemplateData = {
    placeName: string;
    customMessage?: string;
    city?: string;
    unsubscribeUrl?: string;
    placeUrl?: string;
}

export const EMAIL_TEMPLATES = {
    custom: {
        label: 'Własna treść (z edytora CMS)',
        getSubject: (subject?: string) => subject || 'Wiadomość z Kids Places',
        getHtml: (data: EmailTemplateData) => `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2>Witaj!</h2>
                ${data.customMessage || ''}
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">
                    Ta wiadomość została wysłana z platformy <a href="${BRAND_CONFIG.url}">${BRAND_CONFIG.name}</a>.
                </p>
                ${data.unsubscribeUrl ? `<p style="font-size: 11px; color: #aaa;">Aby zrezygnować z otrzymywania wiadomości marketingowych, <a href="${data.unsubscribeUrl}" style="color: #aaa;">kliknij tutaj</a>.</p>` : ''}
            </div>
        `
    },
    partnership_offer: {
        label: 'Propozycja współpracy / Dodanie obiektu',
        getSubject: () => 'Kids Places - darmowa promocja Twojego obiektu!',
        getHtml: (data: EmailTemplateData) => `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <h2 style="color: #FF5A5F;">Dzień dobry :)</h2>
                <p>
                    Nazywam się Marcin Chmura i kontaktuję się z Państwem w imieniu platformy <strong>${BRAND_CONFIG.name}</strong>, nowego katalogu atrakcji dla dzieci. 
                    Chciałbym rozwijać ten portal razem z właścicielami obiektów, którzy chcą promować swoje miejsca, w sposób partnerski i transparentny.
                </p>
                <p>
                    Liczę na to, że uda nam się stworzyć wartościowe narzędzie dla rodziców i atrakcyjne miejsce promocji dla obiektów ze wspólnie wypracowanymi funkcjonalnościami i wartością, która za tym idzie. 
                    Ja ze swojej strony będę dbał o poprawianie widoczności portalu w wyszukiwarkach, promocję w mediach społecznościowych oraz rozwijanie funkcjonalności portalu. 
                    Zachęcam do feedbacku i zgłaszania propozycji, które mogą wpłynąć na rozwój projektu.
                </p>
                <p>
                    Zauważyliśmy, że Państwa obiekt świetnie pasuje do profilu naszego portalu. Chcielibyśmy zaproponować <strong>bezpłatne dodanie go do naszej bazy</strong>, co pozwoli dotrzeć do tysięcy nowych rodzin poszukujących ciekawych miejsc.
                </p>
                <p>
                    Wstępny profil obiektu został już przez nas naszkicowany. Wystarczy założyć darmowe konto, aby przejąć nad nim kontrolę, dodać zdjęcia i zaktualizować godziny otwarcia!
                </p>
                <a href="${data.placeUrl || `${BRAND_CONFIG.url}/rejestracja`}" style="display: inline-block; background-color: #FF5A5F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
                    Zobacz swój profil i odbierz go bezpłatnie
                </a>
                <p style="margin-top: 20px;">
                    W razie jakichkolwiek pytań, zapraszamy do kontaktu, odpowiadając na tę wiadomość.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">
                    Pozdrawiamy serdecznie,<br/>Zespół ${BRAND_CONFIG.name}
                </p>
                ${data.unsubscribeUrl ? `<p style="font-size: 11px; color: #aaa;">Aby zrezygnować z otrzymywania wiadomości marketingowych, <a href="${data.unsubscribeUrl}" style="color: #aaa;">kliknij tutaj</a>.</p>` : ''}
            </div>
        `
    },
    update_request: {
        label: 'Prośba o aktualizację danych przed sezonem',
        getSubject: () => 'Aktualizacja profilu na Kids Places przed nadchodzącym sezonem',
        getHtml: (data: EmailTemplateData) => `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <h2>Dzień dobry :)</h2>
                <p>
                    Zbliża się nowy sezon, w którym tysiące rodziców będą poszukiwać atrakcji na naszej platformie.
                </p>
                <p>
                    Prosimy o zalogowanie się do panelu i weryfikację Państwa oferty na portalu <strong>${BRAND_CONFIG.name}</strong>. Zaktualizowanie godzin otwarcia, cennika oraz dodanie nowych zdjęć znacząco wpłynie na pozycjonowanie profilu.
                </p>
                <a href="${BRAND_CONFIG.url}/login" style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
                    Zaloguj się i zaktualizuj dane
                </a>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">
                    Zespół ${BRAND_CONFIG.name}
                </p>
                ${data.unsubscribeUrl ? `<p style="font-size: 11px; color: #aaa;">Aby zrezygnować z otrzymywania wiadomości marketingowych, <a href="${data.unsubscribeUrl}" style="color: #aaa;">kliknij tutaj</a>.</p>` : ''}
            </div>
        `
    }
}

export type TemplateKey = keyof typeof EMAIL_TEMPLATES;
