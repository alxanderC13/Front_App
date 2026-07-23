// src/presentation/pages/home/HomePage.tsx
import { Link } from 'react-router-dom'
import { Bus, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'

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
  return (
    <div>
      <section className="bg-gradient-to-br from-primary/15 via-accent-red/5 to-background px-4 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Bus className="h-4 w-4" />
            Smart Mobility
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Movilidad inteligente para Quito
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Consulta rutas, paradas y horarios del sistema de transporte público en tiempo real,
            gestionado con QuitoMove.
          </p>
          <Link to="/routes">
            <Button size="lg">Ver rutas disponibles</Button>
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
    </div>
  )
}
