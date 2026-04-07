import { getPayloadClient } from '@/lib/payload-client'
import { verifyUnsubscribeToken } from '@/lib/unsubscribe'
import { BRAND_CONFIG } from '@/lib/config'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const token = searchParams.get('token')

    if (!id || !token || !verifyUnsubscribeToken(id, token)) {
        return new Response(
            renderPage('Nieprawidłowy link', 'Nieprawidłowy lub wygasły link wypisania z listy.'),
            { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        )
    }

    try {
        const payload = await getPayloadClient()
        await payload.update({
            collection: 'places',
            id: Number(id),
            data: { emailOptOut: true },
            overrideAccess: true,
        })

        return new Response(
            renderPage(
                'Wypisano z listy',
                `Twój adres e-mail został usunięty z listy mailingowej ${BRAND_CONFIG.name}. Nie będziesz już otrzymywać wiadomości marketingowych od nas.`,
                true
            ),
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        )
    } catch {
        return new Response(
            renderPage('Wystąpił błąd', 'Nie udało się przetworzyć żądania. Spróbuj ponownie lub skontaktuj się z nami.'),
            { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        )
    }
}

function renderPage(title: string, message: string, success = false) {
    const iconColor = success ? '#22c55e' : '#ef4444'
    const icon = success ? '✓' : '✕'

    return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} – ${BRAND_CONFIG.name}</title>
</head>
<body style="font-family:sans-serif;max-width:560px;margin:80px auto;padding:0 24px;color:#333;text-align:center;">
  <p style="font-size:48px;margin:0 0 16px;"
     aria-hidden="true"
     style="color:${iconColor};">${icon}</p>
  <h1 style="font-size:24px;margin:0 0 12px;">${title}</h1>
  <p style="color:#555;line-height:1.6;">${message}</p>
  <p style="margin-top:48px;font-size:12px;color:#aaa;">
    Pytania? Napisz do nas:
    <a href="mailto:${BRAND_CONFIG.contactEmail}" style="color:#aaa;">${BRAND_CONFIG.contactEmail}</a>
  </p>
</body>
</html>`
}
