// src/presentation/pages/catalog/PublicRouteDetailPage.tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import type { PublicRouteStop } from '../../../domain/entities/PublicRoute'
import { getRouteStopsUseCase } from '../../../infrastructure/factories/public.factory'
import { Skeleton } from '../../components/ui/skeleton'
import { Badge } from '../../components/ui/badge'

export default function PublicRouteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [stops, setStops] = useState<PublicRouteStop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    getRouteStopsUseCase
      .execute(Number(id))
      .then(setStops)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar la ruta'))
      .finally(() => setIsLoading(false))
  }, [id])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        to="/routes"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a rutas
      </Link>

      <h1 className="mb-2 text-2xl font-bold">Detalle de ruta</h1>
      <p className="mb-8 text-muted-foreground">Paradas ordenadas del recorrido</p>

      {error && <p className="text-destructive">{error}</p>}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && stops.length === 0 && !error && (
        <p className="text-muted-foreground">Esta ruta no tiene paradas registradas.</p>
      )}

      <ol className="flex flex-col gap-3">
        {!isLoading &&
          stops.map((stop) => (
            <li key={stop.id} className="flex items-center gap-4 rounded-md border bg-background p-4">
              <Badge variant="secondary" className="shrink-0">
                {stop.stopOrder}
              </Badge>
              <div>
                <p className="font-medium">{stop.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {stop.code} · {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                </div>
              </div>
            </li>
          ))}
      </ol>
    </div>
  )
}
