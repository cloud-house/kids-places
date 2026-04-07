import { NextRequest, NextResponse } from 'next/server'
import { verifyApiKey } from '@/lib/utils/api-auth'

export async function POST(request: NextRequest) {
    try {
        // Verify API key
        verifyApiKey(request)

        console.log('[API] Starting seed operation...')

        // Dynamic imports for the new split seed functions
        const { runSeedCore } = await import('@/scripts/seed-core')
        const { runSeedMock } = await import('@/scripts/seed-mock')

        // Run both seed functions
        await runSeedCore()
        await runSeedMock()

        console.log('[API] Seed operation completed successfully')

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'

        // Handle authentication errors
        if (message === 'Missing API key' || message === 'Invalid API key') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            )
        }

        // Handle other errors
        console.error('[API] Seed operation failed:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Seed operation failed',
                details: message,
            },
            { status: 500 }
        )
    }
}
