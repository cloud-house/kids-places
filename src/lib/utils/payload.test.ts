import { describe, it, expect } from 'vitest'
import { buildCommonWhere } from './payload'

describe('buildCommonWhere', () => {
    it('always includes _status published condition', () => {
        const result = buildCommonWhere({ searchFields: [], cityFields: [] })
        const conditions = result.and as object[]
        expect(conditions).toContainEqual({ _status: { equals: 'published' } })
    })

    it('adds category filter when categorySlug is provided', () => {
        const result = buildCommonWhere({ categorySlug: 'parki', searchFields: [], cityFields: [] })
        const conditions = result.and as object[]
        expect(conditions).toContainEqual({ 'category.slug': { equals: 'parki' } })
    })

    it('adds full-text search across all searchFields', () => {
        const result = buildCommonWhere({ q: 'basen', searchFields: ['name', 'shortDescription'], cityFields: [] })
        const conditions = result.and as object[]
        expect(conditions).toContainEqual({
            or: [
                { name: { contains: 'basen' } },
                { shortDescription: { contains: 'basen' } },
            ],
        })
    })

    it('does not add search condition when q is empty', () => {
        const result = buildCommonWhere({ q: '', searchFields: ['name'], cityFields: [] })
        const conditions = result.and as object[]
        const hasSearch = conditions.some(c => 'or' in c && JSON.stringify(c).includes('contains'))
        expect(hasSearch).toBe(false)
    })

    it('adds city filter across all cityFields', () => {
        const result = buildCommonWhere({
            city: 'Kraków',
            searchFields: [],
            cityFields: ['city.name', 'city.slug'],
        })
        const conditions = result.and as object[]
        expect(conditions).toContainEqual({
            or: [
                { 'city.name': { contains: 'Kraków' } },
                { 'city.slug': { contains: 'Kraków' } },
            ],
        })
    })

    it('adds attribute filter for each attribute', () => {
        const result = buildCommonWhere({
            attributes: { wiek: '3-6', typ: 'kryty' },
            searchFields: [],
            cityFields: [],
        })
        const conditions = result.and as object[]
        expect(conditions).toContainEqual({
            and: [
                { 'features.attribute.slug': { equals: 'wiek' } },
                { 'features.value': { equals: '3-6' } },
            ],
        })
        expect(conditions).toContainEqual({
            and: [
                { 'features.attribute.slug': { equals: 'typ' } },
                { 'features.value': { equals: 'kryty' } },
            ],
        })
    })

    it('adds isPoland filter when provided', () => {
        const result = buildCommonWhere({ isPoland: true, searchFields: [], cityFields: [] })
        const conditions = result.and as object[]
        expect(conditions).toContainEqual({ isPoland: { equals: true } })
    })

    it('does not add isPoland filter when not provided', () => {
        const result = buildCommonWhere({ searchFields: [], cityFields: [] })
        const conditions = result.and as object[]
        const hasIsPoland = conditions.some(c => 'isPoland' in c)
        expect(hasIsPoland).toBe(false)
    })
})
