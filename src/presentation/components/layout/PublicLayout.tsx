// src/presentation/components/layout/PublicLayout.tsx
import { NavLink, Outlet } from 'react-router-dom'
import { Bus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/button'
import ThemeToggle from '../theme-toggle'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/routes', label: 'Rutas' },
  { to: '/contact', label: 'Contacto' },
]

export default function PublicLayout() {
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
            <NavLink to="/login">
              <Button size="sm">Iniciar sesión</Button>
            </NavLink>
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
    </div>
  )
}
