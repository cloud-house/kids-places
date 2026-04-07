# Rule: Payload Hooks Best Practices

Always ensure Payload CMS hooks are robust and handle potential errors.

## Principles

1.  **Error Handling**: Wrap complex hook logic in `try/catch` and use `req.payload.logger.error`.
2.  **Type Safety**: Use types from `payload` (e.g., `BeforeChangeHook`, `AfterDeleteHook`) and `src/payload-types.ts`.
3.  **Cascading Operations**: When deleting an entity, explicitly handle related media and child records (e.g., reviews, claims) to avoid orphaned data.
4.  **Efficiency**: Avoid redundant database calls within hooks. Use the `req` object where possible.

## Example: Media Cleanup on Delete

```typescript
export const deleteMediaHook: AfterDeleteHook = async ({ req, doc }) => {
  if (doc.mediaId) {
    try {
      await req.payload.delete({
        collection: 'media',
        id: doc.mediaId,
      })
    } catch (error) {
      req.payload.logger.error(`Failed to delete media ${doc.mediaId}: ${error}`)
    }
  }
}
```
