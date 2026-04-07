import type { CollectionConfig } from 'payload'
import { render } from '@react-email/components'
import React from 'react'
import { ResetPasswordEmail } from '../../emails/ResetPasswordEmail'
import { BRAND_CONFIG } from '../../lib/config'

import { createDefaultOrganizer } from '../hooks/createDefaultOrganizer'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return false
    },
    // Standard access for read/update can also be added here if needed, 
    // but the request was specifically for admin panel access.
  },
  hooks: {
    afterChange: [createDefaultOrganizer],
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: async (args) => {
        if (!args) return ''
        const { token, user } = args
        // Use user.name if available, otherwise just generic or email? 
        // User type might not have name typed here strictly without casting, but payload passes full user doc.
        const userName = user?.name ? String(user.name) : 'Użytkowniku'
        const resetLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/zresetuj-haslo?token=${token}`

        const html = await render(
          React.createElement(ResetPasswordEmail, { url: resetLink, userName })
        )
        return html
      },
      generateEmailSubject: () => `Zresetuj swoje hasło - ${BRAND_CONFIG.name}`,
    },
  },
  fields: [
    // Email and Password are added by auth: true
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'surname',
      type: 'text',
      required: true,
    },
    {
      name: 'organizerName',
      type: 'text',
      label: 'Nazwa organizacji (podczas rejestracji)',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Rodzic', value: 'parent' },
        { label: 'Organizator', value: 'organizer' },
      ],
      defaultValue: ['parent'],
    },
  ],
}
