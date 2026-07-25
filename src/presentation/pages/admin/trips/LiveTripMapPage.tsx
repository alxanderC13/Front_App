// src/presentation/pages/admin/trips/LiveTripMapPage.tsx
import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { PublicRouteStop, RouteCoordinate } from '../../../../domain/entities/PublicRoute'
import { getRouteStopsUseCase, getRouteCoordinatesUseCase } from '../../../../infrastructure/factories/public.factory'
import { listTripsUseCase } from '../../../../infrastructure/factories/trip.factory'
import LiveTripMap from '../../../components/LiveTripMap'
import { Skeleton } from '../../../components/ui/skeleton'

interface LocationState {
  routeId?: number
  routeCode?: string
}

export default function LiveTripMapPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [routeId, setRouteId] = useState<number | null>(state?.routeId ?? null)
  const [routeCode, setRouteCode] = useState<string>(state?.routeCode ?? '')
  const [stops, setStops] = useState<PublicRouteStop[]>([])
  const [coordinates, setCoordinates] = useState<RouteCoordinate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function resolveRoute() {
      if (routeId) return routeId
      const result = await listTripsUseCase.execute({ page: 1 })
      const trip = result.results.find((t) => t.id === Number(id))
      if (!trip) throw new Error('No se encontró el viaje')
      setRouteCode(trip.routeCode)
      setRouteId(trip.route)
      return trip.route
    }

    setIsLoading(true)
    resolveRoute()
      .then((resolvedRouteId) =>
        Promise.all([
          getRouteStopsUseCase.execute(resolvedRouteId),
          getRouteCoordinatesUseCase.execute(resolvedRouteId),
        ]),
      )
      .then(([stopsResult, coordinatesResult]) => {
        setStops(stopsResult)
        setCoordinates(coordinatesResult)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el mapa'))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/admin/trips"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a viajes
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Mapa en vivo — {routeCode || `Viaje #${id}`}</h1>
        <p className="text-sm text-muted-foreground">
          Seguimiento GPS en tiempo real del vehículo asignado a este viaje
        </p>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {isLoading && <Skeleton className="h-96 w-full" />}

      {!isLoading && !error && id && (
        <LiveTripMap tripId={Number(id)} stops={stops} coordinates={coordinates} heightClassName="h-[28rem]" />
      )}
    </div>
  )
}
