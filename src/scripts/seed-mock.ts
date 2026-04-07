
import nextEnv from '@next/env'
const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

import { getPayload } from 'payload'
import { samplePlaces, sampleEvents } from '../data/seed-data'
import { Place, Event, Ticket } from '@/payload-types'

interface RawTicket {
    name: string;
    price: number;
    description?: string;
    type?: 'one-time' | 'pass' | 'membership';
    entries?: number;
    validityValue?: number;
    validityUnit?: 'days' | 'months' | 'years';
}

interface RawPlace {
    name: string;
    slug: string;
    categorySlug: string;
    city: string;
    street: string;
    postalCode: string;
    email?: string;
    shortDescription: string;
    isFree: boolean;
    tickets?: RawTicket[];
}

interface RawEvent {
    title: string;
    slug: string;
    categorySlug: string;
    organizerName: string;
    startDate: string;
    endDate: string;
    isFree: boolean;
    tickets?: RawTicket[];
    description: string;
    longDescription?: string;
    recurrence: {
        isRecurring: boolean;
        frequency?: string;
        interval?: number;
        daysOfWeek?: string[];
        recurrenceEndDate?: string;
    };
}

const wrapTextInLexical = (text: string) => {
    return {
        root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
                {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                        {
                            mode: 'normal',
                            text: text,
                            type: 'text',
                            style: '',
                            detail: 0,
                            version: 1,
                        },
                    ],
                },
            ],
        },
    }
}

export const runSeedMock = async () => {
    const configModule = await import('../payload.config')
    const config = configModule.default

    const payload = await getPayload({ config })
    console.log('🌱 Starting MOCK data seed...')

    // Helper maps
    const categoryMap = new Map<string, string | number>()
    const cityMap = new Map<string, string | number>()
    const organizerMap = new Map<string, string | number>()

    // Pre-load necessary IDs
    const existingCats = await payload.find({ collection: 'categories', limit: 300 })
    existingCats.docs.forEach(cat => categoryMap.set(cat.slug, cat.id))

    const existingCities = await payload.find({ collection: 'cities', limit: 100 })
    existingCities.docs.forEach(city => {
        if (city.slug) cityMap.set(city.slug, city.id)
        if (city.name) cityMap.set(city.name, city.id)
    })

    const existingOrgs = await payload.find({ collection: 'organizers', limit: 100 })
    existingOrgs.docs.forEach(org => organizerMap.set(org.name, org.id))




    // 5. Seed Sample Places
    console.log('\n--- Seeding Sample Places ---')
    for (const plRaw of samplePlaces) {
        const pl = plRaw as unknown as RawPlace
        const existing = await payload.find({
            collection: 'places',
            where: { slug: { equals: pl.slug } },
        })

        const catId = categoryMap.get(pl.categorySlug)
        const cityId = cityMap.get(pl.city)

        if (!catId || !cityId) {
            console.error(`❌ Category or City not found for place: ${pl.name}`)
            continue
        }

        const { tickets: rawTickets, ...plRest } = pl
        const placeData = {
            ...plRest,
            shortDescription: pl.shortDescription,
            longDescription: pl.shortDescription ? wrapTextInLexical(pl.shortDescription) : undefined,
            category: catId,
            city: cityId,
            _status: 'published',
        }

        let createdOrUpdatedPlace;
        if (existing.docs.length === 0) {
            createdOrUpdatedPlace = await payload.create({
                collection: 'places',
                data: placeData as unknown as Place,
            })
            console.log(`✅ Created Place: ${pl.name}`)
        } else {
            createdOrUpdatedPlace = await payload.update({
                collection: 'places',
                id: existing.docs[0].id,
                data: placeData as unknown as Place,
            })
            console.log(`🔄 Updated Place: ${pl.name}`)
        }

        // Create/Update tickets and link them back to the place
        const ticketIds: (string | number)[] = []
        if (rawTickets && Array.isArray(rawTickets)) {
            for (const ticketData of rawTickets) {
                const createdTicket = await payload.create({
                    collection: 'tickets',
                    data: {
                        ...ticketData,
                        name: `${pl.name} - ${ticketData.name}`,
                        place: createdOrUpdatedPlace.id, // Link to the place
                    } as unknown as Ticket
                })
                ticketIds.push(createdTicket.id)
            }
            
            // Now update the place with the ticket IDs
            await payload.update({
                collection: 'places',
                id: createdOrUpdatedPlace.id,
                data: {
                    tickets: ticketIds,
                } as unknown as Place,
            })
        }
    }

    // 6. Seed Sample Events
    console.log('\n--- Seeding Sample Events ---')
    for (const evRaw of sampleEvents) {
        const ev = evRaw as unknown as RawEvent
        const existing = await payload.find({
            collection: 'events',
            where: { slug: { equals: ev.slug } },
        })

        const catId = categoryMap.get(ev.categorySlug)
        const organizerId = organizerMap.get(ev.organizerName)

        if (!catId || !organizerId) {
            console.error(`❌ Category or Organizer not found for event: ${ev.title}`)
            continue
        }

        const { tickets: rawTickets, ...evRest } = ev
        const eventData = {
            ...evRest,
            description: ev.description ? wrapTextInLexical(ev.description) : undefined,
            category: catId,
            organizer: organizerId,
            _status: 'published',
        }

        let createdOrUpdatedEvent;
        if (existing.docs.length === 0) {
            createdOrUpdatedEvent = await payload.create({
                collection: 'events',
                data: eventData as unknown as Event,
            })
            console.log(`✅ Created Event: ${ev.title}`)
        } else {
            createdOrUpdatedEvent = await payload.update({
                collection: 'events',
                id: existing.docs[0].id,
                data: eventData as unknown as Event,
            })
            console.log(`🔄 Updated Event: ${ev.title}`)
        }

        // Create/Update tickets and link back to the event
        const ticketIds: (string | number)[] = []
        if (rawTickets && Array.isArray(rawTickets)) {
            for (const ticketData of rawTickets) {
                const createdTicket = await payload.create({
                    collection: 'tickets',
                    data: {
                        ...ticketData,
                        name: `${ev.title} - ${ticketData.name}`,
                        event: createdOrUpdatedEvent.id, // Link to the event
                    } as unknown as Ticket
                })
                ticketIds.push(createdTicket.id)
            }
            
            // Now update the event with the ticket IDs
            await payload.update({
                collection: 'events',
                id: createdOrUpdatedEvent.id,
                data: {
                    tickets: ticketIds,
                } as unknown as Event,
            })
        }
    }

    console.log('\n✨ Mock data seed completed successfully!')
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
    runSeedMock()
        .then(() => {
            console.log('✅ Mock seed completed via CLI')
            process.exit(0)
        })
        .catch((err) => {
            console.error('❌ Mock seed failed:', err)
            if (err.data && err.data.errors) {
                console.error('Validation Errors:', JSON.stringify(err.data.errors, null, 2))
            }
            process.exit(1)
        })
}
