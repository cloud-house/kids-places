import React from 'react';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/features/pages/service';
import { BRAND_CONFIG } from '@/lib/config';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { RichText } from '@/components/RichText'
    ;

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) return {};

    return {
        title: `${page.title} - ${BRAND_CONFIG.name} `,
    };
}

export default async function StaticPage({ params }: Props) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-24 pt-8">
            <div className="max-w-4xl mx-auto px-6">
                <Breadcrumbs
                    items={[
                        { label: page.title }
                    ]}
                    className="mb-8"
                />

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h1 className="text-4xl font-black mb-8 text-gray-900">{page.title}</h1>

                    <RichText content={page.content} />

                    <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400">
                        Ostatnia aktualizacja: {new Date(page.updatedAt).toLocaleDateString('pl-PL')}
                    </div>
                </div>
            </div>
        </main>
    );
}
