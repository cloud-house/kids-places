import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateCollection = (pathRoot: string): CollectionAfterChangeHook =>
    async ({ doc, operation }) => {
        if (operation === 'update' || operation === 'create') {
            try {
                revalidatePath(pathRoot)
                if (doc.slug) {
                    revalidatePath(`${pathRoot}/${doc.slug}`)
                }
                revalidatePath('/')
                revalidatePath('/moje-konto')
                console.log(`[Revalidation] Triggered for ${pathRoot} (id: ${doc.id})`)
            } catch (error) {
                console.warn(`[Revalidation] Could not revalidate ${pathRoot}:`, error instanceof Error ? error.message : error)
            }
        }
        return doc
    }

export const revalidateDelete = (pathRoot: string): CollectionAfterDeleteHook =>
    async ({ doc }) => {
        try {
            revalidatePath(pathRoot)
            if (doc.slug) {
                revalidatePath(`${pathRoot}/${doc.slug}`)
            }
            revalidatePath('/')
            revalidatePath('/moje-konto')
            console.log(`[Revalidation] Triggered after delete for ${pathRoot} (id: ${doc.id})`)
        } catch (error) {
            console.warn(`[Revalidation] Could not revalidate ${pathRoot} after delete:`, error instanceof Error ? error.message : error)
        }
        return doc
    }
