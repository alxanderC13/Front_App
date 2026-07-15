// src/presentation/pages/admin/routes/RoutesListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useRouteStore } from '../../../store/route.store'
import { useAuthStore } from '../../../store/auth.store'
import type { RouteEntity } from '../../../../domain/entities/RouteEntity'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../../../components/ui/alert-dialog'
import RouteFormDialog from './RouteFormDialog'

const PAGE_SIZE = 20

export default function RoutesListPage() {
  const {
    routes,
    count,
    page,
    isLoading,
    fetchRoutes,
    fetchLookups,
    setPage,
    setSearch,
    deleteRoute,
  } = useRouteStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<RouteEntity | null>(null)
  const [deletingRoute, setDeletingRoute] = useState<RouteEntity | null>(null)

  useEffect(() => {
    fetchRoutes()
    fetchLookups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  function handleCreate() {
    setEditingRoute(null)
    setFormOpen(true)
  }

  function handleEdit(route: RouteEntity) {
    setEditingRoute(route)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingRoute) return
    try {
      await deleteRoute(deletingRoute.id)
      toast.success('Ruta eliminada correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingRoute(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rutas</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de rutas del sistema de transporte
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva ruta
          </Button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex max-w-sm gap-2">
        <Input
          placeholder="Buscar por código o nombre..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit" variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isAdmin ? 5 : 4 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && routes.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-muted-foreground">
                  No se encontraron rutas.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.code}</TableCell>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>{route.transportCompanyName ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={route.isActive ? 'secondary' : 'outline'}>
                      {route.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(route)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingRoute(route)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      <RouteFormDialog open={formOpen} onOpenChange={setFormOpen} route={editingRoute} />

      <AlertDialog open={!!deletingRoute} onOpenChange={(open) => !open && setDeletingRoute(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ruta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la ruta "{deletingRoute?.name}". Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
