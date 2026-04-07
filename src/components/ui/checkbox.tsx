'use client'

import * as React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, ...props }, ref) => {
        return (
            <input
                type="checkbox"
                ref={ref}
                className={`h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500 cursor-pointer ${className}`}
                onChange={(e) => onCheckedChange?.(e.target.checked)}
                {...props}
            />
        )
    }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
