// src/presentation/components/layout/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Bus,
  Route as RouteIcon,
  Users,
  ClipboardList,
  AlertTriangle,
  Bell,
  UserCircle,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import ThemeToggle from '../theme-toggle'
import { cn } from '../../utils/cn'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { to: '/admin/vehicles', label: 'Vehículos', icon: Bus, adminOnly: true },
  { to: '/admin/routes', label: 'Rutas', icon: RouteIcon, adminOnly: true },
  { to: '/admin/drivers', label: 'Conductores', icon: Users, adminOnly: true },
  { to: '/admin/assignments', label: 'Asignaciones', icon: ClipboardList, adminOnly: true },
  { to: '/admin/trips', label: 'Viajes', icon: RouteIcon, adminOnly: true },
  { to: '/admin/incidents', label: 'Incidentes', icon: AlertTriangle, adminOnly: true },
  { to: '/admin/notifications', label: 'Notificaciones', icon: Bell },
  { to: '/admin/profile', label: 'Mi Perfil', icon: UserCircle },
]

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin())
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="mb-6 px-2">
          <h1 className="text-lg font-bold text-primary">QuitoMove</h1>
          <p className="text-xs text-muted-foreground">Smart Mobility</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="px-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrator' : 'Usuario'}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar (mobile) */}
        <header className="flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
          <h1 className="text-lg font-bold text-primary">QuitoMove</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
