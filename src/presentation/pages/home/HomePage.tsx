// src/presentation/pages/home/HomePage.tsx
import { Link } from 'react-router-dom'
import { Bus, MapPin, Clock, ShieldCheck, AlertTriangle, LayoutDashboard, LogIn } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import AnimatedLogo from '../../components/AnimatedLogo'

const features = [
  {
    icon: MapPin,
    title: 'Rutas en tiempo real',
    description: 'Consulta las rutas activas del sistema de transporte público de Quito.',
  },
  {
    icon: Clock,
    title: 'Paradas y horarios',
    description: 'Encuentra las paradas de cada ruta y su orden dentro del recorrido.',
  },
  {
    icon: ShieldCheck,
    title: 'Gestión administrativa',
    description: 'Panel privado para administrar vehículos, conductores e incidentes.',
  },
]

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin())

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-accent-red/5 to-background px-4 py-24">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <AnimatedLogo className="w-[95%] max-w-4xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl bg-background/70 p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Bus className="h-4 w-4" />
            Smart Mobility
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Movilidad inteligente para Quito
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Consulta rutas, paradas y horarios del sistema de transporte público en tiempo real,
            gestionado con MoviCore.
          </p>
          <Link to="/routes">
            <Button size="lg" className="mt-2">
              Ver rutas disponibles
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const isLast = index === features.length - 1
            return (
              <Card key={feature.title}>
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className={isLast ? "rounded-full bg-accent-red/10 p-3" : "rounded-full bg-primary/10 p-3"}>
                    <feature.icon className={isLast ? "h-6 w-6 text-accent-red" : "h-6 w-6 text-primary"} />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="flex flex-col gap-4">
          {user && (
            <Card className="border-accent-red/20 bg-accent-red/5">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent-red/10 p-2">
                    <AlertTriangle className="h-5 w-5 text-accent-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Estado de las Rutas</h3>
                    <p className="text-sm text-muted-foreground">
                      Conoce las incidencias activas y el estado operativo del transporte.
                    </p>
                  </div>
                </div>
                <Link to="/admin/incidents">
                  <Button variant="outline" className="w-full gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Ver Incidencias
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {!user && (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <LogIn className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Inicia sesión para ver el estado de las rutas
                </p>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {isAdmin && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Panel de Administración</h3>
                    <p className="text-sm text-muted-foreground">
                      Gestiona vehículos, rutas, conductores e incidencias.
                    </p>
                  </div>
                </div>
                <Link to="/admin">
                  <Button variant="secondary" className="w-full gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Ir al Panel Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
