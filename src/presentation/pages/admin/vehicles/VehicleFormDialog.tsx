// src/presentation/pages/admin/vehicles/VehicleFormDialog.tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { Vehicle } from '../../../../domain/entities/Vehicle'
import { useVehicleStore } from '../../../store/vehicle.store'
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

const vehicleSchema = z.object({
  plate: z.string().min(3, 'La placa es requerida').max(10),
  brand: z.string().min(1, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
  year: z.coerce.number().min(1950).max(2100),
  capacity: z.coerce.number().min(1, 'La capacidad debe ser mayor a 0'),
  transportCompany: z.string().nullable(),
  vehicleType: z.string().nullable(),
  vehicleStatus: z.string().nullable(),
})

type VehicleFormInput = z.input<typeof vehicleSchema>
type VehicleFormValues = z.output<typeof vehicleSchema>

interface VehicleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle: Vehicle | null
}

export default function VehicleFormDialog({ open, onOpenChange, vehicle }: VehicleFormDialogProps) {
  const { vehicleTypes, vehicleStatuses, transportCompanies, createVehicle, updateVehicle } =
    useVehicleStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      capacity: 1,
      transportCompany: null,
      vehicleType: null,
      vehicleStatus: null,
    },
  })

  useEffect(() => {
    if (vehicle) {
      reset({
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        capacity: vehicle.capacity,
        transportCompany: vehicle.transportCompany ? String(vehicle.transportCompany) : null,
        vehicleType: vehicle.vehicleType ? String(vehicle.vehicleType) : null,
        vehicleStatus: vehicle.vehicleStatus ? String(vehicle.vehicleStatus) : null,
      })
    } else {
      reset({
        plate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        capacity: 1,
        transportCompany: null,
        vehicleType: null,
        vehicleStatus: null,
      })
    }
  }, [vehicle, reset, open])

  async function onSubmit(values: VehicleFormValues) {
    const dto = {
      plate: values.plate,
      brand: values.brand,
      model: values.model,
      year: values.year,
      capacity: values.capacity,
      transportCompany: values.transportCompany ? Number(values.transportCompany) : null,
      vehicleType: values.vehicleType ? Number(values.vehicleType) : null,
      vehicleStatus: values.vehicleStatus ? Number(values.vehicleStatus) : null,
    }

    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, dto)
        toast.success('Vehículo actualizado correctamente')
      } else {
        await createVehicle(dto)
        toast.success('Vehículo creado correctamente')
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
          <DialogTitle>{vehicle ? 'Editar vehículo' : 'Nuevo vehículo'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="plate">Placa</Label>
              <Input id="plate" {...register('plate')} />
              {errors.plate && <p className="text-xs text-destructive">{errors.plate.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="year">Año</Label>
              <Input id="year" type="number" {...register('year')} />
              {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" {...register('brand')} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" {...register('model')} />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capacidad (pasajeros)</Label>
            <Input id="capacity" type="number" {...register('capacity')} />
            {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Empresa de transporte</Label>
            <Controller
              control={control}
              name="transportCompany"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportCompanies.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Tipo de vehículo</Label>
              <Controller
                control={control}
                name="vehicleType"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Estado</Label>
              <Controller
                control={control}
                name="vehicleStatus"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleStatuses.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
