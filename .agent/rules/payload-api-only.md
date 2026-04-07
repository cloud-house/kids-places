# Rule: Always Use Payload API — Never Direct SQL

All data mutations and reads MUST go through the Payload Local API or REST API. Never use raw SQL or direct database queries to modify data.

## Why?

Payload CMS maintains several side tables and metadata beyond raw data rows:
- `_places_v`, `_events_v` — version/draft tables (bypassed by direct SQL)
- `_payload_locked_documents` — lock state
- Hooks (geocoding, plan sync, media cleanup) only fire through the API

Direct SQL edits produce **invisible changes** — they appear in the DB but Payload admin shows the old data, and hooks are never triggered.

## Rules

1. **Reads**: Use `payload.find()`, `payload.findByID()`, or the REST `GET` endpoint.
2. **Creates**: Use `payload.create()` or `POST /api/{collection}`.
3. **Updates**: Use `payload.update()` or `PATCH /api/{collection}/{id}`.
4. **Deletes**: Use `payload.delete()` — this triggers cascade hooks (media cleanup etc).

## Example

### ❌ Bad
```sql
UPDATE places SET email = 'contact@example.com' WHERE id = 42;
```

### ✅ Good
```typescript
await payload.update({
    collection: 'places',
    id: 42,
    data: { email: 'contact@example.com' },
})
```

## REST API note

When using the REST API from outside Next.js (scripts, curl), always authenticate against the `www.` subdomain — non-www redirects break cookie-based auth.
