// src/presentation/pages/admin/incidents/IncidentsListPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, CheckCircle2, List, Map as MapIcon } from 'lucide-react'
import { useIncidentStore } from '../../../store/incident.store'
import { useAuthStore } from '../../../store/auth.store'
import type { Incident, IncidentSeverity, IncidentStatus } from '../../../../domain/entities/Incident'
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
import IncidentFormDialog from './IncidentFormDialog'
import IncidentMap from '../../../components/IncidentMap'

const PAGE_SIZE = 20

const severityConfig: Record<IncidentSeverity, { label: string; variant: 'outline' | 'secondary' | 'destructive' }> = {
  low: { label: 'Baja', variant: 'outline' },
  medium: { label: 'Media', variant: 'secondary' },
  high: { label: 'Alta', variant: 'destructive' },
}

const statusConfig: Record<IncidentStatus, { label: string }> = {
  open: { label: 'Abierto' },
  in_progress: { label: 'En progreso' },
  resolved: { label: 'Resuelto' },
}

export default function IncidentsListPage() {
  const {
    incidents,
    count,
    page,
    isLoading,
    fetchIncidents,
    fetchOptions,
    setPage,
    resolveIncident,
    deleteIncident,
  } = useIncidentStore()

  const isAdmin = useAuthStore((state) => state.isAdmin())

  const [formOpen, setFormOpen] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  const [deletingIncident, setDeletingIncident] = useState<Incident | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  useEffect(() => {
    fetchIncidents()
    fetchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCreate() {
    setEditingIncident(null)
    setFormOpen(true)
  }

  function handleEdit(incident: Incident) {
    setEditingIncident(incident)
    setFormOpen(true)
  }

  async function handleResolve(incident: Incident) {
    try {
      await resolveIncident(incident.id)
      toast.success('Incidente marcado como resuelto')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al resolver'
      toast.error(message)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingIncident) return
    try {
      await deleteIncident(deletingIncident.id)
      toast.success('Incidente eliminado correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(message)
    } finally {
      setDeletingIncident(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Incidentes</h1>
          <p className="text-sm text-muted-foreground">Gestión de incidentes reportados</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-r-none gap-1"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-l-none gap-1"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-4 w-4" />
              Mapa
            </Button>
          </div>
          {isAdmin && (
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Reportar incidente
            </Button>
          )}
        </div>
      </div>

      {viewMode === 'map' && (
        <div className="flex flex-col gap-3">
          <IncidentMap
            incidents={incidents}
            onSelectIncident={setSelectedIncident}
            heightClassName="h-[28rem]"
          />
          {selectedIncident && (
            <div className="rounded-md border bg-background p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedIncident.incidentTypeName}</h3>
                <Badge
                  variant={
                    selectedIncident.severity === 'high'
                      ? 'destructive'
                      : selectedIncident.severity === 'medium'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {selectedIncident.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{selectedIncident.description}</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-md bg-muted p-2">
                  <p className="text-muted-foreground">Demora est.</p>
                  <p className="font-semibold">
                    {selectedIncident.severity === 'high'
                      ? '~60 min'
                      : selectedIncident.severity === 'medium'
                        ? '~30 min'
                        : '~15 min'}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-muted-foreground">Estado</p>
                  <p className="font-semibold">
                    {selectedIncident.status === 'resolved' ? 'Resuelto' : 'Abierto'}
                  </p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-muted-foreground">Ubicación</p>
                  <p className="font-semibold">
                    {selectedIncident.latitude.toFixed(4)}, {selectedIncident.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'list' && (
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Viaje</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descripción</TableHead>
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

            {!isLoading && incidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center text-muted-foreground">
                  No se encontraron incidentes.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.tripInfo}</TableCell>
                  <TableCell>{incident.incidentTypeName}</TableCell>
                  <TableCell>
                    <Badge variant={severityConfig[incident.severity].variant}>
                      {severityConfig[incident.severity].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{statusConfig[incident.status].label}</TableCell>
                  <TableCell className="max-w-[220px] truncate">{incident.description}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {incident.status !== 'resolved' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-emerald-600 hover:text-emerald-600"
                            onClick={() => handleResolve(incident)}
                            title="Marcar como resuelto"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(incident)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingIncident(incident)}
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
      )}

      {totalPages > 1 && viewMode === 'list' && (
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

      <IncidentFormDialog open={formOpen} onOpenChange={setFormOpen} incident={editingIncident} />

      <AlertDialog
        open={!!deletingIncident}
        onOpenChange={(open) => !open && setDeletingIncident(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar incidente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el incidente reportado en "{deletingIncident?.tripInfo}". Esta
              acción no se puede deshacer.
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
