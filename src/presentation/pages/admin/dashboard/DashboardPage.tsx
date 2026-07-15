// src/presentation/pages/admin/dashboard/DashboardPage.tsx
import { useEffect, useState } from 'react'
import { Bus, Route, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import type { DashboardStats } from '../../../../domain/entities/DashboardStats'
import { getDashboardUseCase } from '../../../../infrastructure/factories/analytics.factory'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { useAuthStore } from '../../../store/auth.store'

const cardsConfig = [
  { key: 'totalTripsToday', label: 'Viajes hoy', icon: Route, suffix: '' },
  { key: 'activeVehicles', label: 'Vehículos activos', icon: Bus, suffix: '' },
  { key: 'totalIncidentsOpen', label: 'Incidentes abiertos', icon: AlertTriangle, suffix: '' },
  { key: 'averageTripDurationMinutes', label: 'Duración promedio', icon: Clock, suffix: ' min' },
  { key: 'punctualityRate', label: 'Tasa de puntualidad', icon: CheckCircle2, suffix: '%' },
] as const

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardUseCase
      .execute()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el dashboard'))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Bienvenido, {user?.username}</h1>
        <p className="text-sm text-muted-foreground">Resumen general del sistema QuitoMove</p>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!stats &&
          !error &&
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}

        {stats &&
          cardsConfig.map((card) => (
            <Card key={card.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {stats[card.key]}
                  {card.suffix}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
