import React from 'react'
import { getEventsForPlace } from '@/features/events/service'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Event } from '@/payload-types'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"



export async function PlaceEventsSection({ placeId }: { placeId: string | number }) {
    const events = await getEventsForPlace(placeId)

    if (!events || events.length === 0) {
        return null
    }

    return (
        <section id="upcoming-events" className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-gray-900">Co się tu dzieje?</h2>
                <Link
                    href="/wydarzenia"
                    className="flex items-center gap-1 text-rose-500 font-bold hover:gap-2 transition-all group"
                >
                    Wszystkie
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full -my-8"
            >
                <CarouselContent className="-ml-4 py-8 px-4">
                    {events.map((event: Event) => {
                        const imageUrl = (typeof event.logo === 'object' && event.logo?.url) ? event.logo.url : null;
                        const startDate = new Date(event.startDate);

                        const dayName = startDate.toLocaleDateString('pl-PL', { weekday: 'short' }).toUpperCase();
                        const day = startDate.getDate();
                        const monthName = startDate.toLocaleDateString('pl-PL', { month: 'long' }).toUpperCase();
                        const time = startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

                        const price = event.isFree ? '0 PLN' : (
                            event.tickets && event.tickets.length > 0
                                ? `${Math.min(...event.tickets.map(t => typeof t === 'object' ? t.price || 0 : 0))} PLN`
                                : 'Płatne'
                        );

                        return (
                            <CarouselItem key={event.id} className="pl-4 basis-[280px] sm:basis-[340px]">
                                <div
                                    className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group h-full"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <Calendar size={48} className="text-gray-200" />
                                            </div>
                                        )}

                                        {/* Price Badge */}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm border border-white/20">
                                            <span className="text-xs font-black text-gray-900 tracking-tight">{price}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-rose-500 font-bold text-[13px] mb-3 tracking-wide">
                                            <Calendar size={14} />
                                            <span>{dayName}, {day} {monthName} • {time}</span>
                                        </div>

                                        <h4 className="text-[22px] font-bold text-gray-900 mb-6 line-clamp-2 leading-tight">
                                            {event.title}
                                        </h4>

                                        <Link href={`/wydarzenia/${event.slug}`}>
                                            <Button className="w-full bg-slate-50 hover:bg-slate-100 text-gray-900 font-bold py-6 rounded-2xl border-none shadow-none text-base transition-colors">
                                                Szczegóły
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious className="-left-4 bg-white/90 backdrop-blur-sm border-none shadow-lg hover:bg-white" />
                    <CarouselNext className="-right-4 bg-white/90 backdrop-blur-sm border-none shadow-lg hover:bg-white" />
                </div>
            </Carousel>
        </section>
    )
}
