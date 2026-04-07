import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/claim/status?success=false&message=Brak tokenu.', request.url));
    }

    // Redirect to the new interactive verification page
    return NextResponse.redirect(new URL(`/claim/verify/${token}`, request.url));
}
