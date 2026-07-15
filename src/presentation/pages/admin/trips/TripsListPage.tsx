// src/presentation/pages/admin/trips/TripsListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useTripStore } from '../../../store/trip.store'
import { useAuthStore } from '../../../store/auth.store'
import type { Trip, TripStatus } from '../../../../domain/entities/Trip'
import { Button } from '../../../components/ui/button'
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
import TripFormDialog from './TripFormDialog'

const PAGE_SIZE = 20

const statusConfig: Record<TripStatus, { label: string; variant: 'secondary' | 'outline' | 'destructive' }> = {
  scheduled: { label: 'Programado', variant: 'outline' },
  in_progress: { label: 'En progreso', variant: 'secondary' },
  completed: { label: 'Completado', variant: 'secondary' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
}

export default function TripsListPage() {
  const { trips, count, page, isLoading, fetchTrips, fetchOptions, setPage, deleteTrip } =
    useTripStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [formOpen, setFormOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null)

  useEffect(() => {
    fetchTrips()
    fetchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCreate() {
    setEditingTrip(null)
    setFormOpen(true)
  }

  function handleEdit(trip: Trip) {
    setEditingTrip(trip)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingTrip) return
    try {
      await deleteTrip(deletingTrip.id)
      toast.success('Viaje eliminado correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingTrip(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Viajes</h1>
          <p className="text-sm text-muted-foreground">Gestión de viajes del sistema</p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo viaje
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ruta</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isAdmin ? 6 : 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && trips.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted-foreground">
                  No se encontraron viajes.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.routeCode}</TableCell>
                  <TableCell>{trip.vehiclePlate}</TableCell>
                  <TableCell>{trip.driverName}</TableCell>
                  <TableCell>{trip.tripDate}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[trip.status].variant}>
                      {statusConfig[trip.status].label}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(trip)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingTrip(trip)}
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

      <TripFormDialog open={formOpen} onOpenChange={setFormOpen} trip={editingTrip} />

      <AlertDialog open={!!deletingTrip} onOpenChange={(open) => !open && setDeletingTrip(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar viaje?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el viaje de la ruta "{deletingTrip?.routeCode}". Esta acción no
              se puede deshacer.
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
