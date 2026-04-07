import type { FieldHook } from 'payload'

export const clearEmptyDate: FieldHook = ({ value }) => {
    if (value === '') {
        return null
    }
    return value
}
