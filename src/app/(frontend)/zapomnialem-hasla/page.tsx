
import React from 'react'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default function ForgotPasswordPage() {
    return (
        <div className="flex-grow bg-gray-50 py-12 px-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 w-full mb-8">
                <Breadcrumbs items={[{ label: 'Odzyskiwanie hasła' }]} />
            </div>
            <div className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Zresetuj hasło</CardTitle>
                        <CardDescription className="text-center">
                            Podaj swój email, aby otrzymać link do zmiany hasła
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ForgotPasswordForm />
                        <div className="mt-4 text-center text-sm">
                            Pamiętasz hasło?{' '}
                            <Link href="/logowanie" className="text-rose-500 hover:underline font-bold">
                                Zaloguj się
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
