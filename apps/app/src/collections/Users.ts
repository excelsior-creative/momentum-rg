import type { CollectionConfig } from 'payload'
import { validatePassword } from './utils/validatePassword'
import { beforeLoginHook } from './hooks/authHooks'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 30 * 60 * 1000, // 30 minutes in milliseconds
    tokenExpiration: 7200, // 2 hours in seconds
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      domain: undefined, // auto-detected
    },
    verify: false, // can enable email verification later
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only admins can read user data
    read: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
    // Only admins can create new users
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
    // Admins can update any user, users can update themselves
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return user.id === id
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
    // Any authenticated user can access the admin panel
    admin: ({ req: { user } }) => !!user,
  },
  hooks: {
    beforeLogin: [beforeLoginHook],
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Only validate password on create or when password is being updated
        if (data?.password && (operation === 'create' || operation === 'update')) {
          const validation = validatePassword(data.password)
          if (!validation.valid) {
            throw new Error(validation.error)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      required: true,
    },
  ],
}

