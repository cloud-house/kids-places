
import React from 'react'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { BRAND_CONFIG } from '@/lib/config'

export default function LoginPage() {
    return (
        <div className="flex-grow bg-gray-50 py-12 px-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 w-full mb-8">
                <Breadcrumbs items={[{ label: 'Logowanie' }]} />
            </div>
            <div className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Witaj ponownie</CardTitle>
                        <CardDescription className="text-center">
                            Zaloguj się do swojego konta {BRAND_CONFIG.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                        <div className="mt-4 text-center text-sm">
                            Nie masz jeszcze konta?{' '}
                            <Link href="/rejestracja" className="text-rose-500 hover:underline font-bold">
                                Zarejestruj się
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
