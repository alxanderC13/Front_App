// src/presentation/router/PrivateRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface PrivateRouteProps {
  requireAdmin?: boolean
}

export default function PrivateRoute({ requireAdmin = false }: PrivateRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const isAdmin = useAuthStore((state) => state.isAdmin())
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const location = useLocation()

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando sesión...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-destructive">
          No tienes permisos de administrador para acceder a esta sección.
        </p>
      </div>
    )
  }

  return <Outlet />
}
