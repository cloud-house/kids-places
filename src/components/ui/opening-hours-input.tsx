'use client'

import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Clock } from 'lucide-react'

interface OpeningHour {
    day: string
    hours: string
}

interface OpeningHoursInputProps {
    value?: OpeningHour[]
    onChange: (value: OpeningHour[]) => void
}

const DAYS = [
    { label: 'Poniedziałek', value: 'monday' },
    { label: 'Wtorek', value: 'tuesday' },
    { label: 'Środa', value: 'wednesday' },
    { label: 'Czwartek', value: 'thursday' },
    { label: 'Piątek', value: 'friday' },
    { label: 'Sobota', value: 'saturday' },
    { label: 'Niedziela', value: 'sunday' },
] as const

export function OpeningHoursInput({ value = [], onChange }: OpeningHoursInputProps) {
    // Ensure all days are present consistently
    useEffect(() => {
        const hasAllDays = DAYS.every(day => value.some(v => v.day === day.value))
        if (!hasAllDays || value.length !== 7) {
            const newValue = DAYS.map(day => {
                const existing = value.find(v => v.day === day.value)
                return existing || { day: day.value, hours: 'Zamknięte' }
            })
            // Sort by DAYS order
            const sortedValue = DAYS.map(day => newValue.find(v => v.day === day.value)!)

            if (JSON.stringify(sortedValue) !== JSON.stringify(value)) {
                onChange(sortedValue)
            }
        }
    }, [value, onChange])

    const updateDay = (dayValue: string, hours: string) => {
        const newValue = DAYS.map(day => {
            const existing = value.find(v => v.day === day.value)
            const currentItem = existing || { day: day.value, hours: 'Zamknięte' }

            if (day.value === dayValue) {
                return { ...currentItem, hours }
            }
            return currentItem
        })
        onChange(newValue)
    }

    const toggleClosed = (dayValue: string, isClosed: boolean) => {
        const existing = value.find(v => v.day === dayValue)
        if (isClosed) {
            updateDay(dayValue, 'Zamknięte')
        } else {
            const restoredHours = existing?.hours === 'Zamknięte' ? '' : (existing?.hours || '')
            updateDay(dayValue, restoredHours)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Harmonogram tygodniowy</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {DAYS.map((day) => {
                    const item = value.find(v => v.day === day.value) || { day: day.value, hours: 'Zamknięte' }
                    const isClosed = item.hours === 'Zamknięte'

                    return (
                        <div
                            key={day.value}
                            className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-[2rem] border transition-all duration-300 ${isClosed
                                    ? 'bg-gray-50/50 border-gray-100'
                                    : 'bg-white border-rose-100/50 shadow-sm shadow-rose-500/5'
                                }`}
                        >
                            <div className="w-32 flex-shrink-0">
                                <span className={`font-bold text-base ${isClosed ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {day.label}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 flex-1">
                                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${isClosed
                                        ? 'bg-rose-50 border-rose-100 text-rose-600'
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}>
                                    <Checkbox
                                        id={`closed-${day.value}`}
                                        checked={isClosed}
                                        onCheckedChange={(checked) => toggleClosed(day.value, !!checked)}
                                        className="h-5 w-5 rounded-lg border-2"
                                    />
                                    <Label
                                        htmlFor={`closed-${day.value}`}
                                        className="text-sm font-black cursor-pointer select-none"
                                    >
                                        ZAMKNIĘTE
                                    </Label>
                                </div>

                                <div className="flex-1 min-w-[200px] relative group">
                                    <Input
                                        placeholder="np. 08:00 - 20:00"
                                        value={isClosed ? '' : item.hours}
                                        onChange={(e) => updateDay(day.value, e.target.value)}
                                        disabled={isClosed}
                                        className={`h-12 rounded-2xl border-gray-100 transition-all font-bold text-gray-700 placeholder:text-gray-300 ${isClosed
                                                ? 'bg-gray-100/30 cursor-not-allowed border-transparent opacity-30'
                                                : 'bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 hover:border-rose-200'
                                            }`}
                                    />
                                    {!isClosed && !item.hours && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="text-[10px] uppercase tracking-widest font-black text-rose-300 animate-pulse">Wpisz godziny</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <p className="text-[10px] text-gray-400 font-bold italic px-2">
                * Zmiany są zapisywane automatycznie w formularzu. Pamiętaj o kliknięciu &quot;Zapisz zmiany&quot; na dole strony.
            </p>
        </div>
    )
}

