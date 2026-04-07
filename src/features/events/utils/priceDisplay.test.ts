import { describe, it, expect } from 'vitest'

// Pure price-display logic extracted from EventCard for testability
function getEventPriceLabel(isFree: boolean, tickets: { price?: number | null }[]): string {
    if (isFree) return 'Bezpłatne'
    if (tickets.length === 0) return 'Płatne'
    const prices = tickets
        .map(t => t.price)
        .filter((p): p is number => p !== null && p !== undefined)
    if (prices.length === 0) return 'Płatne'
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return `${min} PLN`
    return `od ${min} PLN`
}

describe('getEventPriceLabel', () => {
    it('returns Bezpłatne when isFree is true', () => {
        expect(getEventPriceLabel(true, [])).toBe('Bezpłatne')
    })

    it('returns Płatne when no tickets', () => {
        expect(getEventPriceLabel(false, [])).toBe('Płatne')
    })

    it('returns Płatne when tickets have no prices', () => {
        expect(getEventPriceLabel(false, [{ price: null }, { price: undefined }])).toBe('Płatne')
    })

    it('returns exact price when all tickets have same price', () => {
        expect(getEventPriceLabel(false, [{ price: 25 }, { price: 25 }])).toBe('25 PLN')
    })

    it('returns od min when tickets have different prices', () => {
        expect(getEventPriceLabel(false, [{ price: 15 }, { price: 30 }, { price: 50 }])).toBe('od 15 PLN')
    })

    it('returns single price for one ticket', () => {
        expect(getEventPriceLabel(false, [{ price: 40 }])).toBe('40 PLN')
    })
})
