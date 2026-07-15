// src/presentation/pages/admin/incidents/IncidentFormDialog.tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { Incident } from '../../../../domain/entities/Incident'
import { useIncidentStore } from '../../../store/incident.store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'

const severityOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
] as const

const incidentSchema = z.object({
  trip: z.string().min(1, 'Selecciona un viaje'),
  incidentType: z.string().min(1, 'Selecciona un tipo'),
  vehicle: z.string().nullable(),
  driver: z.string().nullable(),
  latitude: z.string().min(1, 'La latitud es requerida'),
  longitude: z.string().min(1, 'La longitud es requerida'),
  description: z.string().min(1, 'La descripción es requerida'),
  severity: z.enum(['low', 'medium', 'high']),
})

type IncidentFormValues = z.infer<typeof incidentSchema>

interface IncidentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  incident: Incident | null
}

export default function IncidentFormDialog({ open, onOpenChange, incident }: IncidentFormDialogProps) {
  const { incidentTypes, tripOptions, vehicleOptions, driverOptions, createIncident, updateIncident } =
    useIncidentStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      trip: '',
      incidentType: '',
      vehicle: null,
      driver: null,
      latitude: '',
      longitude: '',
      description: '',
      severity: 'medium',
    },
  })

  useEffect(() => {
    if (incident) {
      reset({
        trip: String(incident.trip),
        incidentType: String(incident.incidentType),
        vehicle: incident.vehicle ? String(incident.vehicle) : null,
        driver: incident.driver ? String(incident.driver) : null,
        latitude: String(incident.latitude),
        longitude: String(incident.longitude),
        description: incident.description,
        severity: incident.severity,
      })
    } else {
      reset({
        trip: '',
        incidentType: '',
        vehicle: null,
        driver: null,
        latitude: '',
        longitude: '',
        description: '',
        severity: 'medium',
      })
    }
  }, [incident, reset, open])

  async function onSubmit(values: IncidentFormValues) {
    const dto = {
      trip: Number(values.trip),
      incidentType: Number(values.incidentType),
      vehicle: values.vehicle ? Number(values.vehicle) : null,
      driver: values.driver ? Number(values.driver) : null,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      description: values.description,
      severity: values.severity,
    }

    try {
      if (incident) {
        await updateIncident(incident.id, dto)
        toast.success('Incidente actualizado correctamente')
      } else {
        await createIncident(dto)
        toast.success('Incidente reportado correctamente')
      }
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error'
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{incident ? 'Editar incidente' : 'Reportar incidente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Viaje</Label>
            <Controller
              control={control}
              name="trip"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un viaje" />
                  </SelectTrigger>
                  <SelectContent>
                    {tripOptions.map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.trip && <p className="text-xs text-destructive">{errors.trip.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Tipo de incidente</Label>
              <Controller
                control={control}
                name="incidentType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.incidentType && (
                <p className="text-xs text-destructive">{errors.incidentType.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Severidad</Label>
              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Vehículo (opcional)</Label>
              <Controller
                control={control}
                name="vehicle"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleOptions.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Conductor (opcional)</Label>
              <Controller
                control={control}
                name="driver"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Conductor" />
                    </SelectTrigger>
                    <SelectContent>
                      {driverOptions.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input id="latitude" {...register('latitude')} placeholder="-0.1674" />
              {errors.latitude && (
                <p className="text-xs text-destructive">{errors.latitude.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input id="longitude" {...register('longitude')} placeholder="-78.4759" />
              {errors.longitude && (
                <p className="text-xs text-destructive">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={3} {...register('description')} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
