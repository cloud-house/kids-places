import { FieldHook } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const ensureSlug = (field: string): FieldHook =>
    ({ value, data }) => {
        if (typeof value === 'string' && value) return formatSlug(value)
        if (data && field in data && data[field]) return formatSlug(data[field])
        return value
    }
