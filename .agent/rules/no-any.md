# Rule: No Any Type

In this project, using the `any` type in TypeScript is strictly prohibited.

## Why?
Using `any` disables type checking, leading to runtime errors that TypeScript should have caught at the compilation stage.

## What to use instead of `any`?

1.  **`unknown`**: If you truly don't know what type the data will be (e.g., API response), use `unknown`. It forces type checking before the value can be used.
2.  **Interfaces and Types**: Define a precise interface or type that matches the data structure.
3.  **Generics**: Use generic types to maintain flexibility while ensuring type safety.
4.  **Union Types**: If a value can be one of several types, list them (e.g., `string | number`).

## Examples

### ❌ Bad
```typescript
function processData(data: any) {
  console.log(data.name); // No error, even if 'name' doesn't exist
}
```

### ✅ Good
```typescript
interface UserData {
  name: string;
}

function processData(data: UserData) {
  console.log(data.name);
}

// OR using unknown
function processDataSafe(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    console.log((data as { name: string }).name);
  }
}
```
