
import React from 'react'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { BRAND_CONFIG } from '@/lib/config'

export default function RegisterPage() {
    return (
        <div className="flex-grow bg-gray-50 py-12 px-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 w-full mb-8">
                <Breadcrumbs items={[{ label: 'Rejestracja' }]} />
            </div>
            <div className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Utwórz konto</CardTitle>
                        <CardDescription className="text-center">
                            Dołącz do społeczności {BRAND_CONFIG.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegisterForm />
                        <div className="mt-4 text-center text-sm">
                            Masz już konto?{' '}
                            <Link href="/logowanie" className="text-rose-500 hover:underline font-bold">
                                Zaloguj się
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
