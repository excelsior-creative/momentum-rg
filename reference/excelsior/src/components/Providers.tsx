'use client'

import { ContactDialogProvider } from './ContactDialogProvider'
import { SearchProvider } from './SearchProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactDialogProvider>
      <SearchProvider>{children}</SearchProvider>
    </ContactDialogProvider>
  )
}

