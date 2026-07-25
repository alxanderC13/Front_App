// src/presentation/pages/about/AboutPage.tsx
import { Bus, Info, Users, Wrench, Star, GraduationCap, Check } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'

const team = [
  { name: 'Yandri Llumiquinga', role: 'Desarrollador Mobile' },
  { name: 'Edison Tanqueño', role: 'Desarrollador Backend' },
  { name: 'Alexander Calo', role: 'Desarrollador Frontend' },
]

const technologies = ['React', 'TypeScript', 'Vite', 'Django REST', 'PostgreSQL', 'Leaflet']

const features = [
  'Consulta de rutas en tiempo real',
  'Mapa interactivo con paradas',
  'Reporte y seguimiento de incidencias',
  'Gestión administrativa completa',
  'Tema claro y oscuro',
  'Seguimiento GPS en tiempo real',
]

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-red shadow-lg">
          <Bus className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold">MoviCore — MoviCore</h1>
        <p className="mt-1 text-primary">Transporte Público Inteligente</p>
        <Badge variant="secondary" className="mt-2">
          Versión 3.0.0
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        <Section icon={Info} title="Descripción">
          <p className="text-sm text-muted-foreground">
            MoviCore (MoviCore) es una plataforma diseñada para mejorar la experiencia del
            transporte público en la ciudad de Quito, Ecuador. Permite a los usuarios consultar
            rutas, monitorear incidencias en tiempo real y gestionar el sistema de transporte de
            manera eficiente.
          </p>
        </Section>

        <Section icon={Users} title="Equipo de Desarrollo">
          <div className="flex flex-col gap-3">
            {team.map((member, index) => (
              <div key={member.name}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                {index < team.length - 1 && <div className="my-3 border-t" />}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Wrench} title="Tecnologías">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </Section>

        <Section icon={Star} title="Características">
          <div className="flex flex-col gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-success" />
                {feature}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={GraduationCap} title="Proyecto Académico">
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <p>Materia: Programación — Seminario</p>
            <p>Paralelo: Noche</p>
            <p>Instituto: UTE</p>
            <p>Fecha: Julio 2026</p>
          </div>
        </Section>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Hecho con React y Django ❤️
      </p>
    </div>
  )
}
