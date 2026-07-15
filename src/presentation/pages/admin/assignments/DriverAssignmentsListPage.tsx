// src/presentation/pages/admin/assignments/DriverAssignmentsListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useDriverAssignmentStore } from '../../../store/driver-assignment.store'
import { useAuthStore } from '../../../store/auth.store'
import type { DriverAssignment } from '../../../../domain/entities/DriverAssignment'
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
import DriverAssignmentFormDialog from './DriverAssignmentFormDialog'

const PAGE_SIZE = 20

export default function DriverAssignmentsListPage() {
  const {
    assignments,
    count,
    page,
    isLoading,
    fetchAssignments,
    fetchOptions,
    setPage,
    deleteAssignment,
  } = useDriverAssignmentStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [formOpen, setFormOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<DriverAssignment | null>(null)
  const [deletingAssignment, setDeletingAssignment] = useState<DriverAssignment | null>(null)

  useEffect(() => {
    fetchAssignments()
    fetchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCreate() {
    setEditingAssignment(null)
    setFormOpen(true)
  }

  function handleEdit(assignment: DriverAssignment) {
    setEditingAssignment(assignment)
    setFormOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingAssignment) return
    try {
      await deleteAssignment(deletingAssignment.id)
      toast.success('Asignación eliminada correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingAssignment(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Asignaciones</h1>
          <p className="text-sm text-muted-foreground">Asignación de conductores a vehículos</p>
        </div>
        {isAdmin && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva asignación
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conductor</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Fecha asignación</TableHead>
              <TableHead>Fecha fin</TableHead>
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

            {!isLoading && assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted-foreground">
                  No se encontraron asignaciones.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.driverName}</TableCell>
                  <TableCell>{assignment.vehiclePlate}</TableCell>
                  <TableCell>{assignment.assignmentDate}</TableCell>
                  <TableCell>{assignment.endDate ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.isActiveAssignment ? 'secondary' : 'outline'}>
                      {assignment.isActiveAssignment ? 'Activa' : 'Finalizada'}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(assignment)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingAssignment(assignment)}
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

      <DriverAssignmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        assignment={editingAssignment}
      />

      <AlertDialog
        open={!!deletingAssignment}
        onOpenChange={(open) => !open && setDeletingAssignment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asignación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la asignación de "{deletingAssignment?.driverName}" al vehículo
              "{deletingAssignment?.vehiclePlate}". Esta acción no se puede deshacer.
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
