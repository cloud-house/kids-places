'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { toast } from '@payloadcms/ui'

type CrmStatus = 'new' | 'contacted' | 'interested' | 'rejected' | 'active'

type PlaceRow = {
    id: number
    name: string
    email?: string | null
    crmStatus?: CrmStatus | null
    lastContacted?: string | null
    emailOptOut?: boolean | null
    city?: { id: number; name: string } | null
}

type City = { id: number; name: string }

const CRM_STATUS_LABELS: Record<CrmStatus, string> = {
    new: 'Nowy (Lead)',
    contacted: 'Skontaktowano',
    interested: 'Zainteresowany',
    rejected: 'Odrzucił',
    active: 'Partner (Aktywny)',
}

const CRM_STATUS_COLORS: Record<CrmStatus, string> = {
    new: '#3b82f6',
    contacted: '#f59e0b',
    interested: '#10b981',
    rejected: '#ef4444',
    active: '#8b5cf6',
}

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const CrmDashboard: React.FC = () => {
    const [places, setPlaces] = useState<PlaceRow[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<CrmStatus | ''>('')
    const [cityFilter, setCityFilter] = useState<string>('')
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState<number | null>(null)

    const fetchPlaces = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                limit: '500',
                sort: '-lastContacted',
                depth: '1',
            })
            if (statusFilter) params.set('where[crmStatus][equals]', statusFilter)
            if (cityFilter) params.set('where[city][equals]', cityFilter)

            const res = await fetch(`/api/places?${params.toString()}`)
            const data = await res.json()
            setPlaces(data.docs || [])
        } catch {
            toast.error('Błąd podczas ładowania danych')
        } finally {
            setLoading(false)
        }
    }, [statusFilter, cityFilter])

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch('/api/cities?limit=100&sort=name')
                const data = await res.json()
                setCities(data.docs || [])
            } catch {
                // ignore
            }
        }
        fetchCities()
    }, [])

    useEffect(() => {
        fetchPlaces()
    }, [fetchPlaces])

    const updateStatus = async (placeId: number, newStatus: CrmStatus) => {
        setUpdatingId(placeId)
        try {
            const res = await fetch(`/api/places/${placeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crmStatus: newStatus }),
            })
            if (!res.ok) throw new Error('Błąd aktualizacji')
            setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, crmStatus: newStatus } : p))
            toast.success('Status zaktualizowany')
        } catch {
            toast.error('Nie udało się zaktualizować statusu')
        } finally {
            setUpdatingId(null)
        }
    }

    const filtered = places.filter(p => {
        if (search) {
            const q = search.toLowerCase()
            return p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
        }
        return true
    })

    const stats = places.reduce<Record<CrmStatus, number>>(
        (acc, p) => {
            const s = p.crmStatus || 'new'
            acc[s] = (acc[s] || 0) + 1
            return acc
        },
        { new: 0, contacted: 0, interested: 0, rejected: 0, active: 0 }
    )

    return (
        <div style={{ padding: '32px', fontFamily: 'var(--font-body)', color: 'var(--theme-text)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>CRM — Miejsca</h1>
                <a
                    href="/admin/collections/mailings/create"
                    className="btn btn--style-primary"
                    style={{ padding: '8px 16px' }}
                >
                    + Nowy Mailing
                </a>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {(Object.entries(CRM_STATUS_LABELS) as [CrmStatus, string][]).map(([status, label]) => (
                    <div
                        key={status}
                        onClick={() => setStatusFilter(prev => prev === status ? '' : status)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${statusFilter === status ? CRM_STATUS_COLORS[status] : 'var(--theme-elevation-150)'}`,
                            backgroundColor: statusFilter === status ? `${CRM_STATUS_COLORS[status]}18` : 'var(--theme-elevation-50)',
                            cursor: 'pointer',
                            minWidth: '100px',
                        }}
                    >
                        <div style={{ fontSize: '22px', fontWeight: 700, color: CRM_STATUS_COLORS[status] }}>{stats[status]}</div>
                        <div style={{ fontSize: '12px', color: 'var(--theme-text)', opacity: 0.7 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Szukaj po nazwie lub emailu..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid var(--theme-elevation-150)',
                        borderRadius: '4px',
                        backgroundColor: 'var(--theme-bg)',
                        color: 'var(--theme-text)',
                        minWidth: '260px',
                    }}
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as CrmStatus | '')}
                    style={{ padding: '8px 12px', border: '1px solid var(--theme-elevation-150)', borderRadius: '4px', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}
                >
                    <option value="">Wszystkie statusy</option>
                    {(Object.entries(CRM_STATUS_LABELS) as [CrmStatus, string][]).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                    ))}
                </select>
                <select
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid var(--theme-elevation-150)', borderRadius: '4px', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}
                >
                    <option value="">Wszystkie miasta</option>
                    {cities.map(c => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                </select>
                {(statusFilter || cityFilter || search) && (
                    <button
                        type="button"
                        className="btn btn--style-secondary"
                        onClick={() => { setStatusFilter(''); setCityFilter(''); setSearch('') }}
                        style={{ padding: '8px 12px' }}
                    >
                        Wyczyść filtry
                    </button>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Ładowanie...</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--theme-elevation-150)', textAlign: 'left' }}>
                                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Nazwa</th>
                                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Email</th>
                                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Miasto</th>
                                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status CRM</th>
                                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Ostatni kontakt</th>
                                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Zmień status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', opacity: 0.5 }}>
                                        Brak wyników
                                    </td>
                                </tr>
                            )}
                            {filtered.map(place => {
                                const status = place.crmStatus || 'new'
                                return (
                                    <tr
                                        key={place.id}
                                        style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}
                                    >
                                        <td style={{ padding: '10px 12px' }}>
                                            <a
                                                href={`/admin/collections/places/${place.id}`}
                                                style={{ color: 'var(--theme-text)', textDecoration: 'underline', fontWeight: 500 }}
                                            >
                                                {place.name}
                                            </a>
                                            {place.emailOptOut && (
                                                <span style={{ marginLeft: '6px', fontSize: '11px', color: '#ef4444' }}>opt-out</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px 12px', color: place.email ? 'var(--theme-text)' : '#9ca3af' }}>
                                            {place.email || '—'}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            {place.city?.name || '—'}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                backgroundColor: `${CRM_STATUS_COLORS[status]}22`,
                                                color: CRM_STATUS_COLORS[status],
                                                border: `1px solid ${CRM_STATUS_COLORS[status]}44`,
                                            }}>
                                                {CRM_STATUS_LABELS[status]}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 12px', color: 'var(--theme-text)' }}>
                                            {formatDate(place.lastContacted)}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <select
                                                value={status}
                                                disabled={updatingId === place.id}
                                                onChange={e => updateStatus(place.id, e.target.value as CrmStatus)}
                                                style={{
                                                    padding: '4px 8px',
                                                    border: '1px solid var(--theme-elevation-150)',
                                                    borderRadius: '4px',
                                                    backgroundColor: 'var(--theme-bg)',
                                                    color: 'var(--theme-text)',
                                                    fontSize: '13px',
                                                    opacity: updatingId === place.id ? 0.5 : 1,
                                                }}
                                            >
                                                {(Object.entries(CRM_STATUS_LABELS) as [CrmStatus, string][]).map(([v, l]) => (
                                                    <option key={v} value={v}>{l}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.5 }}>
                        {filtered.length} / {places.length} miejsc
                    </div>
                </div>
            )}
        </div>
    )
}
