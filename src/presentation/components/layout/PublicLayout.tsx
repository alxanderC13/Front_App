// src/presentation/components/layout/PublicLayout.tsx
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bus, Bell, LogOut } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/button'
import ThemeToggle from '../theme-toggle'
import { useAuthStore } from '../../store/auth.store'
import { useNotificationBadgeStore } from '../../store/notification-badge.store'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/routes', label: 'Rutas' },
  { to: '/contact', label: 'Contacto' },
  { to: '/about', label: 'Acerca de' },
]

export default function PublicLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const { unreadCount, fetchUnreadCount } = useNotificationBadgeStore()
  const navigate = useNavigate()
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)

  useEffect(() => {
    if (user) fetchUnreadCount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function handleLogout() {
    logout()
    setConfirmLogoutOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-primary">
            <Bus className="h-5 w-5" />
            QuitoMove
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <NavLink to="/admin/notifications" className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/admin">
                  <Button variant="outline" size="sm">
                    Mi panel
                  </Button>
                </NavLink>
                <Button variant="ghost" size="icon" onClick={() => setConfirmLogoutOpen(true)}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <NavLink to="/login">
                <Button size="sm">Iniciar sesión</Button>
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/30 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          QuitoMove — Movilidad inteligente para Quito. Proyecto académico.
        </div>
      </footer>

      <AlertDialog open={confirmLogoutOpen} onOpenChange={setConfirmLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cerrar sesión?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sí, cerrar sesión</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
