// src/presentation/pages/admin/vehicles/VehiclesListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useVehicleStore } from '../../../store/vehicle.store'
import { useAuthStore } from '../../../store/auth.store'
import type { Vehicle } from '../../../../domain/entities/Vehicle'
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
import VehicleFormDialog from './VehicleFormDialog'

const PAGE_SIZE = 20

export default function VehiclesListPage() {
  const {
    vehicles,
    count,
    page,
    isLoading,
    fetchVehicles,
    fetchLookups,
    setPage,
    setSearch,
    deleteVehicle,
  } = useVehicleStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    fetchVehicles()
    fetchLookups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  function handleCreate() {
    setEditingVehicle(null)
    setFormOpen(true)
  }

  function handleEdit(vehicle: Vehicle) {
    setEditingVehicle(vehicle)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingVehicle) return
    try {
      await deleteVehicle(deletingVehicle.id)
      toast.success('Vehículo eliminado correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingVehicle(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vehículos</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de la flota de vehículos de transporte
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo vehículo
          </Button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex max-w-sm gap-2">
        <Input
          placeholder="Buscar por placa, marca o modelo..."
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
              <TableHead>Placa</TableHead>
              <TableHead>Marca / Modelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isAdmin ? 8 : 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && vehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} className="text-center text-muted-foreground">
                  No se encontraron vehículos.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>
                    {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.transportCompanyName ?? '—'}</TableCell>
                  <TableCell>{vehicle.vehicleTypeName ?? '—'}</TableCell>
                  <TableCell>
                    {vehicle.vehicleStatusName ? (
                      <Badge variant="secondary">{vehicle.vehicleStatusName}</Badge>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingVehicle(vehicle)}
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

      <VehicleFormDialog open={formOpen} onOpenChange={setFormOpen} vehicle={editingVehicle} />

      <AlertDialog open={!!deletingVehicle} onOpenChange={(open) => !open && setDeletingVehicle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el vehículo con placa "{deletingVehicle?.plate}". Esta acción
              no se puede deshacer.
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

