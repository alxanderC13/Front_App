// src/presentation/pages/admin/drivers/DriversListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useDriverStore } from '../../../store/driver.store'
import { useAuthStore } from '../../../store/auth.store'
import type { Driver } from '../../../../domain/entities/Driver'
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
import DriverFormDialog from './DriverFormDialog'

const PAGE_SIZE = 20

export default function DriversListPage() {
  const { drivers, count, page, isLoading, fetchDrivers, setPage, setSearch, deleteDriver } =
    useDriverStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [searchInput, setSearchInput] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null)

  useEffect(() => {
    fetchDrivers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
  }

  function handleCreate() {
    setEditingDriver(null)
    setFormOpen(true)
  }

  function handleEdit(driver: Driver) {
    setEditingDriver(driver)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingDriver) return
    try {
      await deleteDriver(deletingDriver.id)
      toast.success('Conductor eliminado correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingDriver(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conductores</h1>
          <p className="text-sm text-muted-foreground">Gestión de conductores del sistema</p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo conductor
          </Button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex max-w-sm gap-2">
        <Input
          placeholder="Buscar por usuario o licencia..."
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
              <TableHead>Usuario</TableHead>
              <TableHead>Licencia</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Experiencia</TableHead>
              <TableHead>Disponibilidad</TableHead>
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

            {!isLoading && drivers.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted-foreground">
                  No se encontraron conductores.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">
                    {driver.userFullName || driver.userUsername}
                  </TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>Tipo {driver.licenseType}</TableCell>
                  <TableCell>{driver.experienceYears} años</TableCell>
                  <TableCell>
                    <Badge variant={driver.isAvailable ? 'secondary' : 'outline'}>
                      {driver.isAvailable ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(driver)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingDriver(driver)}
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

      <DriverFormDialog open={formOpen} onOpenChange={setFormOpen} driver={editingDriver} />

      <AlertDialog open={!!deletingDriver} onOpenChange={(open) => !open && setDeletingDriver(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar conductor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará al conductor "{deletingDriver?.userFullName}". Esta acción no
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
