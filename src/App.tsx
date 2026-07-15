// src/App.tsx
import { useEffect } from 'react'
import AppRouter from './presentation/router/AppRouter'
import { useAuthStore } from './presentation/store/auth.store'
import { Toaster } from './presentation/components/ui/sonner'

export default function App() {
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser)

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </>
  )
}