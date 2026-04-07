'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Place, Event, Category, User as UserType, Review, Attribute, Organizer } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, MapPin, Calendar, Settings, Building2 } from 'lucide-react';
import { getPremiumStatus } from '@/features/account/utils';
import {
    createPlaceAction,
    deletePlaceAction,
    updatePlaceAction,
    createEventAction,
    deleteEventAction,
    updateEventAction
} from '@/features/account/actions';
import { PlaceForm } from '@/features/account/components/PlaceForm';
import { EventForm } from '@/features/account/components/EventForm';
import { OrganizerReviews } from '@/features/account/components/OrganizerReviews';
import { ParentReviews } from '@/features/account/components/ParentReviews';
import { OrganizerRegistrations } from '@/features/account/components/OrganizerRegistrations';
import { AccountSettings } from '@/features/account/components/AccountSettings';
import { OrganizationSettings } from '@/features/account/components/OrganizationSettings';
import { AccountSidebar, TabType } from '@/features/account/components/AccountSidebar';
import { EmptyState } from '@/features/account/components/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Inquiry } from '@/payload-types';
import { toast } from 'sonner';

interface ManageAccountContentProps {
    user: UserType;
    places: Place[];
    events: Event[];
    categories: Category[];
    reviews: Review[];
    reviewsMode: 'parent' | 'organizer';
    attributes: Attribute[];
    planLimits: {
        maxPlaces: number;
        maxEvents: number;
    };
    inquiries?: (Inquiry & { sourceName?: string })[];
    planName?: string;
    organizer?: Organizer;
}

export const ManageAccountContent: React.FC<ManageAccountContentProps> = ({
    user,
    places,
    events,
    categories,
    reviews,
    reviewsMode,
    attributes,
    planLimits,
    inquiries,
    planName = 'Free',
    organizer,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>(reviewsMode === 'parent' ? 'reviews' : 'places');
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [editingItem, setEditingItem] = useState<Place | Event | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: number, type: TabType } | null>(null);
    const [isPending, startTransition] = useTransition();

    // Local state for optimistic updates
    const [localPlaces, setLocalPlaces] = useState<Place[]>(places);
    const [localEvents, setLocalEvents] = useState<Event[]>(events);

    // Sync local state with props when they change (e.g. after server actions)
    useEffect(() => {
        setLocalPlaces(places);
    }, [places]);

    useEffect(() => {
        setLocalEvents(events);
    }, [events]);



    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (searchParams.get('success')) {
            router.refresh(); // Force re-fetch of server data (e.g. updated plan)
            toast.success('Twój plan został pomyślnie zaktualizowany!');
            router.replace(pathname);
        }
        if (searchParams.get('canceled')) {
            toast.info('Płatność została anulowana.');
            router.replace(pathname);
        }

        const initCheckout = searchParams.get('initCheckout');
        if (initCheckout) {
            const triggerCheckout = async () => {
                setIsLoading(true);
                const mode = searchParams.get('mode') || 'recurring';
                const interval = searchParams.get('interval') || 'month';
                try {
                    const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            planId: initCheckout,
                            mode,
                            interval,
                        }),
                    });
                    const data = await res.json();
                    if (data.url) {
                        window.location.href = data.url;
                    } else {
                        toast.error(data.error || 'Błąd inicjowania płatności.');
                        router.replace(pathname);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Błąd połączenia ze Stripe.');
                    router.replace(pathname);
                } finally {
                    setIsLoading(false);
                }
            };
            triggerCheckout();
        }
    }, [searchParams, router, pathname]);


    const premiumStatus = getPremiumStatus(organizer);
    const { isPremium, expiresAt } = premiumStatus;

    const hasReachedPlacesLimit = planLimits.maxPlaces !== -1 && places.length >= planLimits.maxPlaces;
    const hasReachedEventsLimit = planLimits.maxEvents !== -1 && events.length >= planLimits.maxEvents;

    const handlePlaceSubmit = async (data: Parameters<typeof createPlaceAction>[0]) => {
        if (!editingItem && hasReachedPlacesLimit) {
            toast.error('Osiągnięto limit miejsc dla Twojego planu.');
            return;
        }
        setIsLoading(true);
        try {
            const res = editingItem ? await updatePlaceAction((editingItem as Place).id, data) : await createPlaceAction(data);
            if (res.success) {
                toast.success(res.message);

                // Optimistic update for local list if editing
                if (editingItem) {
                    setLocalPlaces(prev => prev.map(p => p.id === (editingItem as Place).id ? { ...p, ...data } as unknown as Place : p));
                }

                setIsAddingMode(false);
                setEditingItem(null);

                startTransition(() => {
                    router.refresh();
                });
            } else {
                toast.error(res.error || 'Wystąpił błąd.');
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error('Wystąpił błąd podczas zapisywania.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEventSubmit = async (data: Parameters<typeof createEventAction>[0]) => {
        if (!editingItem && hasReachedEventsLimit) {
            toast.error('Osiągnięto limit wydarzeń dla Twojego planu.');
            return;
        }
        setIsLoading(true);
        try {
            const res = editingItem ? await updateEventAction((editingItem as Event).id, data) : await createEventAction(data);
            if (res.success) {
                toast.success(res.message);

                if (editingItem) {
                    setLocalEvents(prev => prev.map(e => e.id === (editingItem as Event).id ? { ...e, ...data } as unknown as Event : e));
                }

                setIsAddingMode(false);
                setEditingItem(null);

                startTransition(() => {
                    router.refresh();
                });
            } else {
                toast.error(res.error || 'Wystąpił błąd.');
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error('Wystąpił błąd podczas zapisywania.');
        } finally {
            setIsLoading(false);
        }
    };



    const handleDelete = async (id: number, type: TabType) => {
        setDeleteConfirmation({ id, type });
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;
        const { id, type } = deleteConfirmation;

        // Save original states for rollback
        const originalPlaces = [...localPlaces];
        const originalEvents = [...localEvents];

        // Optimistic update
        if (type === 'places') setLocalPlaces(prev => prev.filter(p => p.id !== id));
        else if (type === 'events') setLocalEvents(prev => prev.filter(e => e.id !== id));

        setIsLoading(true);
        setDeleteConfirmation(null); // Close modal immediately

        try {
            let res;
            if (type === 'places') res = await deletePlaceAction(id);
            else res = await deleteEventAction(id);

            if (res.success) {
                toast.success(res.message || 'Usunięto pomyślnie.');
                startTransition(() => {
                    router.refresh();
                });
            } else {
                // Rollback on failure
                if (type === 'places') setLocalPlaces(originalPlaces);
                else if (type === 'events') setLocalEvents(originalEvents);
                toast.error(res.error || 'Błąd podczas usuwania.');
            }
        } catch (error) {
            console.error(error);
            // Rollback on error
            if (type === 'places') setLocalPlaces(originalPlaces);
            else if (type === 'events') setLocalEvents(originalEvents);
            toast.error('Błąd podczas usuwania.');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate generic stats/limits status
    const isLimitReached = (activeTab === 'places' && hasReachedPlacesLimit) ||
        (activeTab === 'events' && hasReachedEventsLimit);

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Sidebar */}
            <AccountSidebar
                user={user}
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    setIsAddingMode(false);
                    setEditingItem(null);
                }}
                reviewsMode={reviewsMode}
                planName={planName}
                premiumExpiresAt={expiresAt}
                stats={{
                    places: { current: localPlaces.length, max: planLimits.maxPlaces },
                    events: { current: localEvents.length, max: planLimits.maxEvents },
                    registrations: inquiries?.length || 0,
                    reviews: reviews.length,
                }}
            />

            {/* Content Area */}
            <div className="flex-1 min-w-0 w-full">

                {/* Header for Content Area (Search, Add Button etc - context dependent) */}
                {!isAddingMode && !editingItem && activeTab !== 'settings' && (
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {activeTab === 'places' ? 'Twoje Miejsca' :
                                    activeTab === 'events' ? 'Twoje Wydarzenia' :
                                        activeTab === 'registrations' ? 'Twoje Zapisy' :
                                            activeTab === 'organization' ? 'Profil Organizacji' :
                                                'Twoje Opinie'}
                            </h2>
                            {isPending && (
                                <div className="w-5 h-5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                            )}
                        </div>

                        {(activeTab === 'places' || activeTab === 'events') && (
                            <div className="flex items-center gap-4">
                                {isLimitReached && (
                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                        Limit osiągnięty
                                    </span>
                                )}
                                <Button
                                    onClick={() => setIsAddingMode(true)}
                                    disabled={isLoading || isPending || isLimitReached}
                                    className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-5 h-10 font-bold shadow-lg shadow-rose-100 transition-all hover:scale-[1.02]"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Dodaj {activeTab === 'places' ? 'miejsce' : 'wydarzenie'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="w-full">
                    {activeTab === 'settings' ? (
                        <AccountSettings
                            user={user}
                            organizer={organizer}
                            reviewsMode={reviewsMode}
                            planLimits={planLimits}
                            counts={{
                                places: localPlaces.length,
                                events: localEvents.length,
                            }}
                        />
                    ) : activeTab === 'organization' ? (
                        organizer ? (
                            <OrganizationSettings
                                organizer={organizer}
                                isPremium={isPremium}
                            />
                        ) : (
                            <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex flex-col items-center text-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                    <Building2 size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-amber-900">Brak profilu organizacji</h3>
                                <p className="text-amber-700 max-w-md">Nie znaleźliśmy profilu Twojej organizacji. Powinien on zostać utworzony automatycznie. Skontaktuj się z obsługą, jeśli problem będzie się powtarzał.</p>
                            </div>
                        )
                    ) : (isAddingMode || editingItem) ? (
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                <h3 className="text-lg font-bold">
                                    {editingItem ? 'Edytuj element' : 'Dodaj nowy element'}
                                </h3>
                                <Button
                                    variant="ghost"
                                    onClick={() => { setIsAddingMode(false); setEditingItem(null); }}
                                    className="text-gray-400 hover:text-gray-900"
                                >
                                    Anuluj
                                </Button>
                            </div>

                            {activeTab === 'places' && (
                                <PlaceForm
                                    key={editingItem ? `${(editingItem as Place).id}-${(editingItem as Place).updatedAt}` : 'new-place'}
                                    place={editingItem as Place || undefined}
                                    categories={categories}
                                    attributes={attributes}
                                    isPremium={isPremium}
                                    onSubmit={handlePlaceSubmit}
                                    onCancel={() => { setIsAddingMode(false); setEditingItem(null); }}
                                    isLoading={isLoading || isPending}
                                />
                            )}
                            {activeTab === 'events' && (
                                <EventForm
                                    key={editingItem ? `${(editingItem as Event).id}-${(editingItem as Event).updatedAt}` : 'new-event'}
                                    event={editingItem as Event || undefined}
                                    categories={categories}
                                    places={localPlaces}
                                    attributes={attributes}
                                    isPremium={isPremium}
                                    onSubmit={handleEventSubmit}
                                    onCancel={() => { setIsAddingMode(false); setEditingItem(null); }}
                                    isLoading={isLoading || isPending}
                                />
                            )}

                        </div>
                    ) : (
                        <div className="grid gap-6 animate-in fade-in duration-500">
                            {activeTab === 'places' && (
                                <>
                                    {localPlaces.map(place => (
                                        <div key={place.id} className="group bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform flex-shrink-0">
                                                    {(typeof place.logo === 'object' && place.logo?.url) ? (
                                                        <Image
                                                            src={place.logo.url}
                                                            alt={place.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <MapPin size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-gray-900 leading-tight">{place.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                        <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                                            <MapPin size={12} /> {place.street ? `${place.street}, ` : ''}{typeof place.city === 'object' ? place.city.name : 'Brak miasta'}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-widest ${place._status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {place._status === 'published' ? 'Publiczne' : 'Szkic'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-xl h-11 w-11 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                                                    onClick={() => setEditingItem(place)}
                                                >
                                                    <Settings size={20} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-xl h-11 w-11 p-0 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                                    disabled={isLoading}
                                                    onClick={() => handleDelete(place.id, 'places')}
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {localPlaces.length === 0 && (
                                        <EmptyState
                                            icon={MapPin}
                                            message="Nie masz jeszcze żadnych dodanych miejsc."
                                        />
                                    )}
                                </>
                            )}

                            {activeTab === 'events' && (
                                <>
                                    {localEvents.map(event => (
                                        <div key={event.id} className="group bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform flex-shrink-0">
                                                    {(typeof event.logo === 'object' && event.logo?.url) ? (
                                                        <Image
                                                            src={event.logo.url}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <Calendar size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-gray-900 leading-tight">{event.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                        <span className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                                            <Calendar size={12} /> {new Date(event.startDate).toLocaleDateString('pl-PL')}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-widest ${event._status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {event._status === 'published' ? 'Publiczne' : 'Szkic'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-xl h-11 w-11 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                                                    onClick={() => setEditingItem(event)}
                                                >
                                                    <Settings size={20} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="rounded-xl h-11 w-11 p-0 text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                                    disabled={isLoading}
                                                    onClick={() => handleDelete(event.id, 'events')}
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {localEvents.length === 0 && (
                                        <EmptyState
                                            icon={Calendar}
                                            message="Nie masz jeszcze żadnych dodanych wydarzeń."
                                        />
                                    )}
                                </>
                            )}



                            {activeTab === 'registrations' && (
                                <OrganizerRegistrations inquiries={inquiries || []} />
                            )}

                            {activeTab === 'reviews' && (
                                reviewsMode === 'organizer' ? (
                                    <OrganizerReviews reviews={reviews} />
                                ) : (
                                    <ParentReviews reviews={reviews} />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>



            <ConfirmModal
                isOpen={!!deleteConfirmation}
                onClose={() => setDeleteConfirmation(null)}
                onConfirm={confirmDelete}
                title="Potwierdź usunięcie"
                description="Czy na pewno chcesz usunąć ten element? Ta operacja jest nieodwracalna."
                confirmLabel="Usuń"
                cancelLabel="Anuluj"
                variant="destructive"
                isLoading={isLoading}
            />
        </div >
    );
};
