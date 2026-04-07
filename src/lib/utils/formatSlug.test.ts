import { describe, it, expect } from 'vitest'
import { formatSlug } from './formatSlug'

describe('formatSlug', () => {
    it('lowercases input', () => {
        expect(formatSlug('Gdańsk')).toBe('gdansk')
    })

    it('strips Polish diacritics', () => {
        expect(formatSlug('Łódź')).toBe('lodz')
        expect(formatSlug('Kraków')).toBe('krakow')
        expect(formatSlug('Wrocław')).toBe('wroclaw')
        expect(formatSlug('Świętokrzyski')).toBe('swietokrzyski')
    })

    it('replaces spaces with hyphens', () => {
        expect(formatSlug('Park Rozrywki')).toBe('park-rozrywki')
    })

    it('removes special characters', () => {
        expect(formatSlug('Klub! & Dzieci?')).toBe('klub--dzieci')
    })

    it('handles empty string', () => {
        expect(formatSlug('')).toBe('')
    })

    it('handles already-slugified input', () => {
        expect(formatSlug('park-rozrywki')).toBe('park-rozrywki')
    })
})
