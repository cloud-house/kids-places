'use server'

import { getPayloadClient } from '@/lib/payload-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// ... keep imports
// LOGIN ACTION
export async function loginAction(data: { email?: string; password?: string }) {
    const payload = await getPayloadClient()

    try {
        const result = await payload.login({
            collection: 'users',
            data: {
                email: data.email || '',
                password: data.password || '',
            },
        })

        if (result.token) {
            const cookieStore = await cookies()
            cookieStore.set('payload-token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        return { success: true, user: result.user, message: 'Zalogowano pomyślnie.' }
    } catch {
        return { success: false, error: 'Nieprawidłowy adres email lub hasło.' }
    }
}

// ... REGISTER ACTION
export async function registerAction(data: { email?: string; password?: string; name?: string; surname?: string; role?: 'parent' | 'organizer'; plan?: string; mode?: 'recurring' | 'onetime'; interval?: 'month' | 'year'; next?: string; organizationName?: string }) {
    const payload = await getPayloadClient()

    try {
        const userData = {
            email: data.email || '',
            password: data.password || '',
            name: data.name || '',
            surname: data.surname || '',
            organizerName: data.organizationName,
            roles: [data.role || 'parent'] as ('admin' | 'parent' | 'organizer')[],
            plan: (data.plan && data.role === 'organizer') ? Number(data.plan) : undefined,
        };

        const result = await payload.create({
            collection: 'users',
            data: userData,
        })

        // Auto login after register
        if (result) {
            // We need to login separately to get the token
            const loginResult = await payload.login({
                collection: 'users',
                data: {
                    email: data.email || '',
                    password: data.password || ''
                }
            })

            if (loginResult.token) {
                const cookieStore = await cookies()
                cookieStore.set('payload-token', loginResult.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                })
            }
        }

        let redirectPath = data.next || '/moje-konto';

        // If a plan was selected, we might want to go straight to checkout or account with a trigger
        if (data.plan && data.role === 'organizer') {
            // Check if plan is FREE or PAID
            const planDoc = await payload.findByID({
                collection: 'pricing-plans',
                id: data.plan
            });

            if (planDoc && planDoc.planPrice_recurring > 0) {
                const mode = data.mode || 'recurring';
                const interval = data.interval || 'month';
                redirectPath = `/moje-konto?initCheckout=${data.plan}&mode=${mode}&interval=${interval}`;
            }
        }

        return { success: true, message: 'Konto zostało utworzone.', redirectPath }
    } catch (error: unknown) {
        if (error instanceof Error && error.message?.includes('unique')) {
            return { success: false, error: 'Konto z tym adresem email już istnieje.' }
        }
        return { success: false, error: error instanceof Error ? error.message : 'Rejestracja nie powiodła się.' }
    }
}

// ... FORGOT PASSWORD
export async function forgotPasswordAction(email: string) {
    const payload = await getPayloadClient()
    try {
        await payload.forgotPassword({
            collection: 'users',
            data: {
                email,
            },
            disableEmail: false, // Ensure emails are sent (requires email config)
        })
        return { success: true, message: 'Instrukcje resetowania hasła zostały wysłane na e-mail.' }
    } catch {
        // We generally don't want to reveal if email exists or not for security, but for now:
        return { success: false, error: 'Wystąpił błąd podczas wysyłania e-maila.' }
    }
}

// ... RESET PASSWORD
export async function resetPasswordAction(token: string, password?: string) {
    const payload = await getPayloadClient()
    try {
        await payload.resetPassword({
            collection: 'users',
            data: {
                token,
                password: password || '',
            },
            overrideAccess: true,
        })
        return { success: true, message: 'Hasło zostało zmienione. Możesz się teraz zalogować.' }
    } catch (error) {
        console.error('Reset password error:', error)
        return { success: false, error: 'Link wygasł lub jest nieprawidłowy.' }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')
    redirect('/logowanie')
}
