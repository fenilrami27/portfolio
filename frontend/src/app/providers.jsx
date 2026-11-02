import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '../context/ThemeContext'
import { AdminAuthProvider } from '../admin/context/AdminAuthContext'
import { AdminToastProvider } from '../admin/components/AdminToast'

export function AppProviders({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  )

  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AdminAuthProvider>
            <AdminToastProvider>{children}</AdminToastProvider>
          </AdminAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
