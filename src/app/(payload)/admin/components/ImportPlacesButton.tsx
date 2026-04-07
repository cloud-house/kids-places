'use client'

import React, { useState, useEffect } from 'react'
import { toast } from '@payloadcms/ui'

export const ImportPlacesButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [cityId, setCityId] = useState('')
    const [categoryId, setcategoryId] = useState('')
    const [maxResults, setMaxResults] = useState(20)
    const [cities, setCities] = useState<{ id: string; name: string }[]>([])
    const [categories, setCategories] = useState<{ id: string; title: string }[]>([])

    // Polling states
    const [loading, setLoading] = useState(false)
    const [runId, setRunId] = useState<string | null>(null)
    const [statusText, setStatusText] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cityRes = await fetch('/api/cities?limit=100')
                const categoryRes = await fetch('/api/categories?limit=100')
                const cityData = await cityRes.json()
                const categoryData = await categoryRes.json()
                setCities(cityData.docs || [])
                setCategories(categoryData.docs || [])
            } catch (err) {
                console.error('Failed to fetch cities/categories', err)
            }
        }
        if (isOpen) fetchData()
    }, [isOpen])

    // Polling effect
    useEffect(() => {
        let interval: NodeJS.Timeout

        const checkStatus = async () => {
            if (!runId) return

            try {
                const res = await fetch(`/api/apify-status?runId=${runId}&cityId=${cityId}&categoryId=${categoryId}`)
                const data = await res.json()

                if (data.error) {
                    toast.error(data.error)
                    setLoading(false)
                    setRunId(null)
                    return
                }

                if (data.status === 'SUCCEEDED') {
                    toast.success(`Import zakończony! Wyniki: ${data.results.length}`)
                    setLoading(false)
                    setRunId(null)
                    setStatusText('Gotowe! Odśwież stronę, aby zobaczyć nowe miejsca.')
                    setIsOpen(false)
                } else if (data.status === 'FAILED') {
                    toast.error('Proces Apify zakończył się niepowodzeniem.')
                    setLoading(false)
                    setRunId(null)
                } else {
                    setStatusText(`Status procesu: ${data.status}... (Czekaj, to potrwa kilka minut)`)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (runId) {
            interval = setInterval(checkStatus, 10000) // Poll every 10 seconds
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [runId, cityId, categoryId])

    const handleImport = async () => {
        if (!query || !cityId || !categoryId) {
            toast.error('Wypełnij wszystkie pola')
            return
        }

        setLoading(true)
        setStatusText('Uruchamianie procesu Apify...')
        try {
            const res = await fetch('/api/apify-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, cityId, categoryId, maxResults }),
            })
            const data = await res.json()

            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            } else {
                toast.success('Proces rozpoczęty. Trwa wyciąganie danych w tle.')
                setRunId(data.runId)
                setStatusText('Proces: RUNNING... (Trwa przeszukiwanie Google Maps i stron WWW)')
            }
        } catch {
            toast.error('Błąd podczas uruchamiania importu')
            setLoading(false)
        }
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <button
                type="button"
                className="btn btn--style-primary"
                onClick={() => setIsOpen(!isOpen)}
                style={{ padding: '8px 15px', cursor: 'pointer' }}
                disabled={loading}
            >
                {loading ? 'Trwa import...' : (isOpen ? 'Anuluj Import' : 'Importuj z Apify')}
            </button>

            {loading && statusText && (
                <div style={{ marginTop: '10px', color: 'orange', fontWeight: 'bold' }}>
                    {statusText}
                </div>
            )}

            {isOpen && !loading && (
                <div style={{
                    marginTop: '10px',
                    padding: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'var(--theme-bg)'
                }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Wyszukaj (np. &quot;Restauracje przyjazne dzieciom Gdynia&quot;):</label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ width: '100%', padding: '8px', color: 'black' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Miasto:</label>
                            <select
                                value={cityId}
                                onChange={(e) => setCityId(e.target.value)}
                                style={{ width: '100%', padding: '8px', color: 'black' }}
                            >
                                <option value="">Wybierz...</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Kategoria:</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setcategoryId(e.target.value)}
                                style={{ width: '100%', padding: '8px', color: 'black' }}
                            >
                                <option value="">Wybierz...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Limit wyników:</label>
                        <input
                            type="number"
                            min={1}
                            max={200}
                            value={maxResults}
                            onChange={(e) => setMaxResults(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px', color: 'black' }}
                        />
                    </div>

                    <button
                        className="btn btn--style-secondary"
                        onClick={handleImport}
                        style={{ width: '100%' }}
                    >
                        Uruchom Bota Apify
                    </button>
                    <p style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
                        UWAGA: Proces może potrwać kilka minut, ponieważ bot wejdzie na każdą stronę w poszukiwaniu e-maili i profili social media. PROSZĘ NIE ZAMYKAĆ TEJ KARTY PRZEGLĄDARKI.
                    </p>
                </div>
            )}
        </div>
    )
}
