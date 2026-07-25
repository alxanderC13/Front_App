// src/presentation/pages/admin/stops/BusStopFormDialog.tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { BusStop } from '../../../../domain/entities/BusStop'
import { useBusStopStore } from '../../../store/bus-stop.store'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'

const busStopSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  latitude: z.string().min(1, 'La latitud es requerida'),
  longitude: z.string().min(1, 'La longitud es requerida'),
  sector: z.string().nullable(),
})

type BusStopFormValues = z.infer<typeof busStopSchema>

interface BusStopFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  busStop: BusStop | null
}

export default function BusStopFormDialog({ open, onOpenChange, busStop }: BusStopFormDialogProps) {
  const { sectors, createBusStop, updateBusStop } = useBusStopStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusStopFormValues>({
    resolver: zodResolver(busStopSchema),
    defaultValues: {
      code: '',
      name: '',
      latitude: '',
      longitude: '',
      sector: null,
    },
  })

  useEffect(() => {
    if (busStop) {
      reset({
        code: busStop.code,
        name: busStop.name,
        latitude: String(busStop.latitude),
        longitude: String(busStop.longitude),
        sector: busStop.sector ? String(busStop.sector) : null,
      })
    } else {
      reset({
        code: '',
        name: '',
        latitude: '',
        longitude: '',
        sector: null,
      })
    }
  }, [busStop, reset, open])

  async function onSubmit(values: BusStopFormValues) {
    const dto = {
      code: values.code,
      name: values.name,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      sector: values.sector ? Number(values.sector) : null,
    }

    try {
      if (busStop) {
        await updateBusStop(busStop.id, dto)
        toast.success('Parada actualizada correctamente')
      } else {
        await createBusStop(dto)
        toast.success('Parada creada correctamente')
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
          <DialogTitle>{busStop ? 'Editar parada' : 'Nueva parada'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" {...register('code')} placeholder="BS-RIO" />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Sector (opcional)</Label>
              <Controller
                control={control}
                name="sector"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={String(sector.id)}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register('name')} placeholder="Terminal Río Coca" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input id="latitude" {...register('latitude')} placeholder="-0.1694" />
              {errors.latitude && (
                <p className="text-xs text-destructive">{errors.latitude.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input id="longitude" {...register('longitude')} placeholder="-78.4779" />
              {errors.longitude && (
                <p className="text-xs text-destructive">{errors.longitude.message}</p>
              )}
            </div>
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
