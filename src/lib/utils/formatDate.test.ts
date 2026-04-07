import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
    it('formats a date string to Polish locale', () => {
        const result = formatDate('2024-06-15')
        expect(result).toContain('2024')
        expect(result).toContain('15')
    })

    it('formats a Date object', () => {
        const date = new Date(2024, 0, 1) // 1 January 2024
        const result = formatDate(date)
        expect(result).toContain('2024')
        expect(result).toContain('1')
    })

    it('includes the month name in Polish', () => {
        const result = formatDate('2024-03-10')
        expect(result).toMatch(/marca|marzec/i)
    })

    it('includes the year', () => {
        const result = formatDate('2025-12-25')
        expect(result).toContain('2025')
    })
})
