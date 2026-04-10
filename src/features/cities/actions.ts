'use server';

import { cookies } from 'next/headers';

export async function setCityCookie(slug: string) {
    const cookieStore = await cookies();
    if (slug === 'all' || !slug) {
        cookieStore.delete('kp_city_slug');
    } else {
        // Set cookie with 1 year expiration
        cookieStore.set('kp_city_slug', slug, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
        });
    }
}
