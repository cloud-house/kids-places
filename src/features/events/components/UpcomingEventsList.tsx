
import React from 'react'
import { getEventsForPlace } from '@/features/events/service'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

import { Event } from '@/payload-types'

export async function UpcomingEventsList({ placeId }: { placeId: string | number }) {
    const events = await getEventsForPlace(placeId)

    if (!events || events.length === 0) {
        return <p className="text-gray-500 text-sm">Brak nadchodzących wydarzeń.</p>
    }

    return (
        <div className="space-y-4">
            {events.map((event: Event) => (
                <Link href={`/wydarzenia/${event.slug}`} key={event.id} className="block group">
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-rose-100 rounded-lg flex flex-col items-center justify-center text-rose-500 font-bold shrink-0">
                            <span className="text-xs">{new Date(event.startDate).toLocaleString('pl-PL', { month: 'short' }).toUpperCase()}</span>
                            <span className="text-lg leading-none">{new Date(event.startDate).getDate()}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm group-hover:text-rose-500 transition-colors line-clamp-2">{event.title}</h4>
                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                                <Calendar size={12} />
                                <span>{new Date(event.startDate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            <Link href="/wydarzenia" className="block text-center text-sm text-rose-500 font-bold hover:underline mt-2">
                Zobacz wszystkie
            </Link>
        </div>
    )
}
