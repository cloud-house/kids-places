import { getPayloadClient } from '@/lib/payload-client'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { BRAND_CONFIG } from '@/lib/config'
import { Suspense } from 'react'
import { AccountDashboardContent } from '@/features/account/components/AccountDashboardContent'
import { AccountDashboardSkeleton } from '@/features/account/components/AccountDashboardSkeleton'

export const dynamic = 'force-dynamic'

export default async function MyAccountPage() {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
        redirect('/logowanie')
    }

    return (
        <div className="flex-grow bg-gray-50 min-h-screen">
            <div className="py-12 px-4 max-w-7xl mx-auto">
                <Breadcrumbs items={[{ label: 'Moje Konto' }]} />
                <div className="mb-8 mt-4">
                    <h1 className="text-3xl font-bold text-gray-900">Witaj, {user.name}!</h1>
                    <p className="text-gray-500">Zarządzaj swoją aktywnością w {BRAND_CONFIG.name}</p>
                </div>

                <Suspense fallback={<AccountDashboardSkeleton />}>
                    <AccountDashboardContent
                        userId={user.id}
                        userName={user.name || ''}
                        userRoles={user.roles || []}
                    />
                </Suspense>
            </div>
        </div >
    )
}

