// src/presentation/pages/admin/stops/BusStopsListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useBusStopStore } from '../../../store/bus-stop.store'
import { useAuthStore } from '../../../store/auth.store'
import type { BusStop } from '../../../../domain/entities/BusStop'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
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
import BusStopFormDialog from './BusStopFormDialog'

const PAGE_SIZE = 20

export default function BusStopsListPage() {
  const {
    busStops,
    count,
    page,
    isLoading,
    fetchBusStops,
    fetchSectors,
    setPage,
    setSearch,
    deleteBusStop,
  } = useBusStopStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingBusStop, setEditingBusStop] = useState<BusStop | null>(null)
  const [deletingBusStop, setDeletingBusStop] = useState<BusStop | null>(null)

  useEffect(() => {
    fetchBusStops()
    fetchSectors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  function handleCreate() {
    setEditingBusStop(null)
    setFormOpen(true)
  }

  function handleEdit(busStop: BusStop) {
    setEditingBusStop(busStop)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingBusStop) return
    try {
      await deleteBusStop(deletingBusStop.id)
      toast.success('Parada eliminada correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingBusStop(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paradas</h1>
          <p className="text-sm text-muted-foreground">Gestión de paradas del sistema de transporte</p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva parada
          </Button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
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
              <TableHead>Sector</TableHead>
              <TableHead>Coordenadas</TableHead>
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

            {!isLoading && busStops.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} className="text-center text-muted-foreground">
                  No se encontraron paradas.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              busStops.map((busStop) => (
                <TableRow key={busStop.id}>
                  <TableCell className="font-medium">{busStop.code}</TableCell>
                  <TableCell>{busStop.name}</TableCell>
                  <TableCell>{busStop.sectorName ?? '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {busStop.latitude.toFixed(4)}, {busStop.longitude.toFixed(4)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(busStop)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingBusStop(busStop)}
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

      <BusStopFormDialog open={formOpen} onOpenChange={setFormOpen} busStop={editingBusStop} />

      <AlertDialog open={!!deletingBusStop} onOpenChange={(open) => !open && setDeletingBusStop(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar parada?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la parada "{deletingBusStop?.name}". Esta acción no se puede deshacer.
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
