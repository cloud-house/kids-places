
import React from 'react'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { redirect } from 'next/navigation'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
    const { token } = await searchParams

    if (!token || typeof token !== 'string') {
        redirect('/zapomnialem-hasla')
    }

    return (
        <div className="flex-grow bg-gray-50 py-12 px-4 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 w-full mb-8">
                <Breadcrumbs items={[{ label: 'Resetowanie hasła' }]} />
            </div>
            <div className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Ustaw nowe hasło</CardTitle>
                        <CardDescription className="text-center">
                            Wprowadź i potwierdź swoje nowe hasło
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResetPasswordForm token={token} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
