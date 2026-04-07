'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus } from 'lucide-react'

interface ScheduleItem {
    dayOfWeek: string
    startTime: string
    duration?: string
}

interface ScheduleInputProps {
    value?: ScheduleItem[]
    onChange: (value: ScheduleItem[]) => void
}

const DAYS = [
    { label: 'Poniedziałek', value: 'monday' },
    { label: 'Wtorek', value: 'tuesday' },
    { label: 'Środa', value: 'wednesday' },
    { label: 'Czwartek', value: 'thursday' },
    { label: 'Piątek', value: 'friday' },
    { label: 'Sobota', value: 'saturday' },
    { label: 'Niedziela', value: 'sunday' },
]

export function ScheduleInput({ value = [], onChange }: ScheduleInputProps) {
    const addRow = () => {
        onChange([...value, { dayOfWeek: 'monday', startTime: '', duration: '' }])
    }

    const removeRow = (index: number) => {
        const newValue = [...value]
        newValue.splice(index, 1)
        onChange(newValue)
    }

    const updateRow = (index: number, field: keyof ScheduleItem, val: string) => {
        const newValue = [...value]
        newValue[index] = { ...newValue[index], [field]: val }
        onChange(newValue)
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Harmonogram zajęć</label>
                <Button type="button" variant="outline" size="sm" onClick={addRow}>
                    <Plus className="h-4 w-4 mr-1" /> Dodaj termin
                </Button>
            </div>

            {value.length === 0 && (
                <p className="text-sm text-gray-500 italic">Brak dodanych terminów.</p>
            )}

            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center border p-2 rounded-md bg-white">
                        <Select
                            value={item.dayOfWeek}
                            onValueChange={(val) => updateRow(index, 'dayOfWeek', val)}
                        >
                            <SelectTrigger className="w-full md:w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DAYS.map(day => (
                                    <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-2 flex-1 w-full">
                            <Input
                                placeholder="Godzina (np. 17:00)"
                                value={item.startTime}
                                onChange={(e) => updateRow(index, 'startTime', e.target.value)}
                            />
                            <Input
                                placeholder="Czas (np. 45 min)"
                                value={item.duration || ''}
                                onChange={(e) => updateRow(index, 'duration', e.target.value)}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(index)}
                            className="text-gray-400 hover:text-red-500 self-end md:self-center"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
