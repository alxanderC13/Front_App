// src/presentation/pages/admin/trips/TripFormDialog.tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { Trip } from '../../../../domain/entities/Trip'
import { useTripStore } from '../../../store/trip.store'
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

const statusOptions = [
  { value: 'scheduled', label: 'Programado' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
] as const

const tripSchema = z.object({
  route: z.string().min(1, 'Selecciona una ruta'),
  vehicle: z.string().min(1, 'Selecciona un vehículo'),
  driver: z.string().min(1, 'Selecciona un conductor'),
  tripDate: z.string().min(1, 'La fecha es requerida'),
  departureDatetime: z.string().min(1, 'La hora de salida es requerida'),
  arrivalDatetime: z.string().optional().default(''),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  passengerCount: z.string().optional().default(''),
  observations: z.string().optional().default(''),
})

// Input = lo que escribe el usuario (campos opcionales pueden ser undefined)
// Output = lo que entrega zod ya validado y con defaults aplicados
type TripFormInput = z.input<typeof tripSchema>
type TripFormOutput = z.output<typeof tripSchema>

interface TripFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: Trip | null
}

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 16)
}

export default function TripFormDialog({ open, onOpenChange, trip }: TripFormDialogProps) {
  const { routeOptions, vehicleOptions, driverOptions, createTrip, updateTrip } = useTripStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TripFormInput, unknown, TripFormOutput>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      route: '',
      vehicle: '',
      driver: '',
      tripDate: '',
      departureDatetime: '',
      arrivalDatetime: '',
      status: 'scheduled',
      passengerCount: '',
      observations: '',
    },
  })

  useEffect(() => {
    if (trip) {
      reset({
        route: String(trip.route),
        vehicle: String(trip.vehicle),
        driver: String(trip.driver),
        tripDate: trip.tripDate,
        departureDatetime: toDatetimeLocal(trip.departureDatetime),
        arrivalDatetime: toDatetimeLocal(trip.arrivalDatetime),
        status: trip.status,
        passengerCount: trip.passengerCount ? String(trip.passengerCount) : '',
        observations: trip.observations,
      })
    } else {
      reset({
        route: '',
        vehicle: '',
        driver: '',
        tripDate: '',
        departureDatetime: '',
        arrivalDatetime: '',
        status: 'scheduled',
        passengerCount: '',
        observations: '',
      })
    }
  }, [trip, reset, open])

  async function onSubmit(values: TripFormOutput) {
    const dto = {
      route: Number(values.route),
      vehicle: Number(values.vehicle),
      driver: Number(values.driver),
      schedule: null,
      tripDate: values.tripDate,
      departureDatetime: new Date(values.departureDatetime).toISOString(),
      arrivalDatetime: values.arrivalDatetime
        ? new Date(values.arrivalDatetime).toISOString()
        : null,
      status: values.status,
      passengerCount: values.passengerCount ? Number(values.passengerCount) : null,
      observations: values.observations ?? '',
    }

    try {
      if (trip) {
        await updateTrip(trip.id, dto)
        toast.success('Viaje actualizado correctamente')
      } else {
        await createTrip(dto)
        toast.success('Viaje creado correctamente')
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
          <DialogTitle>{trip ? 'Editar viaje' : 'Nuevo viaje'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Ruta</Label>
            <Controller
              control={control}
              name="route"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    {routeOptions.map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.route && <p className="text-xs text-destructive">{errors.route.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Vehículo</Label>
              <Controller
                control={control}
                name="vehicle"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
              {errors.vehicle && (
                <p className="text-xs text-destructive">{errors.vehicle.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Conductor</Label>
              <Controller
                control={control}
                name="driver"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
              {errors.driver && (
                <p className="text-xs text-destructive">{errors.driver.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tripDate">Fecha del viaje</Label>
              <Input id="tripDate" type="date" {...register('tripDate')} />
              {errors.tripDate && (
                <p className="text-xs text-destructive">{errors.tripDate.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Estado</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
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
              <Label htmlFor="departureDatetime">Salida</Label>
              <Input id="departureDatetime" type="datetime-local" {...register('departureDatetime')} />
              {errors.departureDatetime && (
                <p className="text-xs text-destructive">{errors.departureDatetime.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="arrivalDatetime">Llegada (opcional)</Label>
              <Input id="arrivalDatetime" type="datetime-local" {...register('arrivalDatetime')} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="passengerCount">Pasajeros (opcional)</Label>
            <Input id="passengerCount" type="number" {...register('passengerCount')} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea id="observations" rows={2} {...register('observations')} />
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
