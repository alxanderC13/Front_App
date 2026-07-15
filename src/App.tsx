// src/App.tsx
import { useEffect } from 'react'
import AppRouter from './presentation/router/AppRouter'
import { useAuthStore } from './presentation/store/auth.store'

export default function App() {
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser)

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  return <AppRouter />
}
