import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateCollection = (pathRoot: string): CollectionAfterChangeHook =>
    async ({ doc, operation, req, context }) => {
        if (context?.skipRevalidation) return doc
        if (operation === 'update' || operation === 'create') {
            try {
                revalidatePath(pathRoot)
                if (doc.slug) {
                    revalidatePath(`${pathRoot}/${doc.slug}`)
                }
                revalidatePath('/')
                revalidatePath('/moje-konto')
                req.payload.logger.info(`[Revalidation] Triggered for ${pathRoot} (id: ${doc.id})`)
            } catch (error) {
                req.payload.logger.warn({ err: error }, `[Revalidation] Could not revalidate ${pathRoot}`)
            }
        }
        return doc
    }

export const revalidateDelete = (pathRoot: string): CollectionAfterDeleteHook =>
    async ({ doc, req }) => {
        try {
            revalidatePath(pathRoot)
            if (doc.slug) {
                revalidatePath(`${pathRoot}/${doc.slug}`)
            }
            revalidatePath('/')
            revalidatePath('/moje-konto')
            req.payload.logger.info(`[Revalidation] Triggered after delete for ${pathRoot} (id: ${doc.id})`)
        } catch (error) {
            req.payload.logger.warn({ err: error }, `[Revalidation] Could not revalidate ${pathRoot} after delete`)
        }
        return doc
    }
