'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const CrmNavLink: React.FC = () => {
    const pathname = usePathname()
    const isActive = pathname?.startsWith('/admin/crm')

    return (
        <div style={{ padding: '0 16px', marginTop: '4px' }}>
            <Link
                href="/admin/crm"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    color: isActive ? 'var(--theme-text)' : 'var(--theme-text)',
                    backgroundColor: isActive ? 'var(--theme-elevation-100)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '14px',
                    transition: 'background-color 0.15s',
                }}
            >
                CRM
            </Link>
        </div>
    )
}
