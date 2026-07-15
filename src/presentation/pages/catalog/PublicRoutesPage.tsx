// src/presentation/pages/catalog/PublicRoutesPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import type { PublicRoute } from '../../../domain/entities/PublicRoute'
import { listPublicRoutesUseCase } from '../../../infrastructure/factories/public.factory'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Skeleton } from '../../components/ui/skeleton'

export default function PublicRoutesPage() {
  const [routes, setRoutes] = useState<PublicRoute[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    listPublicRoutesUseCase
      .execute(search)
      .then((result) => {
        if (active) setRoutes(result.results)
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
  }, [search])

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
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}

        {!isLoading && routes.length === 0 && !error && (
          <p className="col-span-full text-center text-muted-foreground">
            No se encontraron rutas.
          </p>
        )}

        {!isLoading &&
          routes.map((route) => (
            <Link key={route.id} to={`/routes/${route.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <MapPin className="h-4 w-4" />
                    {route.code}
                  </div>
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {route.description || 'Sin descripción disponible.'}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                    Ver detalle <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
