// src/presentation/pages/catalog/PublicRoutesPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Clock, Milestone, Repeat } from 'lucide-react'
import type { PublicRoute, RouteCoordinate } from '../../../domain/entities/PublicRoute'
import {
  listPublicRoutesUseCase,
  getRouteStopsUseCase,
  getRouteCoordinatesUseCase,
} from '../../../infrastructure/factories/public.factory'
import { listSchedulesByRouteUseCase } from '../../../infrastructure/factories/schedule.factory'
import { useAuthStore } from '../../store/auth.store'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Skeleton } from '../../components/ui/skeleton'
import { Badge } from '../../components/ui/badge'
import RouteMiniMap from '../../components/RouteMiniMap'

const ASSUMED_SPEED_KMH = 22

interface RouteExtraInfo {
  stopsCount: number
  coordinates: RouteCoordinate[]
  estimatedMinutes: number | null
  frequencyMinutes: number | null
}

function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0])
  const lat2 = toRad(b[0])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function routeDistanceMeters(coordinates: RouteCoordinate[]): number {
  const sorted = [...coordinates].sort((a, b) => a.order - b.order)
  let total = 0
  for (let i = 0; i < sorted.length - 1; i++) {
    total += haversineMeters(
      [sorted[i].latitude, sorted[i].longitude],
      [sorted[i + 1].latitude, sorted[i + 1].longitude],
    )
  }
  return total
}

export default function PublicRoutesPage() {
  const user = useAuthStore((state) => state.user)
  const [routes, setRoutes] = useState<PublicRoute[]>([])
  const [extraInfo, setExtraInfo] = useState<Record<number, RouteExtraInfo>>({})
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    listPublicRoutesUseCase
      .execute(search)
      .then(async (result) => {
        if (!active) return
        setRoutes(result.results)

        const infoEntries = await Promise.all(
          result.results.map(async (route) => {
            const [stops, coordinates] = await Promise.all([
              getRouteStopsUseCase.execute(route.id).catch(() => []),
              getRouteCoordinatesUseCase.execute(route.id).catch(() => []),
            ])

            let frequencyMinutes: number | null = null
            if (user) {
              try {
                const schedules = await listSchedulesByRouteUseCase.execute(route.id)
                frequencyMinutes = schedules[0]?.frequencyMinutes ?? null
              } catch {
                frequencyMinutes = null
              }
            }

            const distanceMeters = routeDistanceMeters(coordinates)
            const estimatedMinutes =
              distanceMeters > 0 ? Math.round((distanceMeters / 1000 / ASSUMED_SPEED_KMH) * 60) : null

            const info: RouteExtraInfo = {
              stopsCount: stops.length,
              coordinates,
              estimatedMinutes,
              frequencyMinutes,
            }
            return [route.id, info] as const
          }),
        )

        if (active) {
          setExtraInfo(Object.fromEntries(infoEntries))
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar rutas')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, user])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rutas disponibles</h1>
        <p className="mt-2 text-muted-foreground">
          Consulta todas las rutas activas del sistema de transporte
        </p>
      </div>

      <Input
        placeholder="Buscar por código o nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 max-w-sm"
      />

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}

        {!isLoading && routes.length === 0 && !error && (
          <p className="col-span-full text-center text-muted-foreground">
            No se encontraron rutas.
          </p>
        )}

        {!isLoading &&
          routes.map((route) => {
            const info = extraInfo[route.id]
            return (
              <Link key={route.id} to={`/routes/${route.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  {info && <RouteMiniMap coordinates={info.coordinates} />}
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <MapPin className="h-4 w-4" />
                      {route.code}
                    </div>
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {info && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Milestone className="h-3 w-3" />
                          {info.stopsCount} paradas
                        </Badge>
                        {info.estimatedMinutes !== null && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            ~{info.estimatedMinutes} min
                          </Badge>
                        )}
                        {info.frequencyMinutes !== null && (
                          <Badge variant="outline" className="gap-1">
                            <Repeat className="h-3 w-3" />
                            Cada {info.frequencyMinutes} min
                          </Badge>
                        )}
                      </div>
                    )}
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {route.description || 'Sin descripción disponible.'}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                      Ver detalle <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
      </div>
    </div>
  )
}
