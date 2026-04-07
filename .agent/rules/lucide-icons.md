# Rule: Lucid Icons & Shared Icons

Maintain a consistent icon set across the project.

## Principles

1.  **Lucide React**: Use `lucide-react` for all UI icons.
2.  **Shared Icons Strategy**: Define icons like `<Star />`, `<MapPin />`, etc., with common `size={16}` or `size={14}` for regular indicators.
3.  **Color Context**: Use Tailwind's utility classes (e.g., `text-amber-500` for stars) rather than hex values in the SVG props whenever possible.
4.  **Accessibility**: Ensure icons have `aria-hidden="true"` if they are purely decorative or appropriate labels if they act as buttons.

## Examples

```tsx
import { Star, MapPin } from 'lucide-react';

<div className="flex items-center gap-1 text-amber-500">
    <Star size={16} fill="currentColor" />
    <span className="font-bold">4.5</span>
</div>

<div className="flex items-start gap-1 text-gray-400">
    <MapPin className="min-w-[14px]" size={14} />
    <span>Street Name, City</span>
</div>
```
