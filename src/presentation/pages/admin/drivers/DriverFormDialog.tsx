// src/presentation/pages/admin/drivers/DriverFormDialog.tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { Driver } from '../../../../domain/entities/Driver'
import { useDriverStore } from '../../../store/driver.store'
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

const licenseOptions = [
  { value: 'A', label: 'Tipo A (Automóvil)' },
  { value: 'B', label: 'Tipo B (Camioneta)' },
  { value: 'C', label: 'Tipo C (Bus)' },
  { value: 'D', label: 'Tipo D (Camión)' },
  { value: 'E', label: 'Tipo E (Pesado)' },
] as const

const driverSchema = z.object({
  user: z.coerce.number().min(1, 'El ID de usuario es requerido'),
  licenseNumber: z.string().min(1, 'La licencia es requerida').max(30),
  licenseType: z.enum(['A', 'B', 'C', 'D', 'E']),
  hireDate: z.string().min(1, 'La fecha de contratación es requerida'),
  experienceYears: z.coerce.number().min(0),
  observations: z.string().optional().default(''),
  isAvailable: z.enum(['true', 'false']),
})

type DriverFormInput = z.input<typeof driverSchema>
type DriverFormValues = z.output<typeof driverSchema>

interface DriverFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver: Driver | null
}

export default function DriverFormDialog({ open, onOpenChange, driver }: DriverFormDialogProps) {
  const { createDriver, updateDriver } = useDriverStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormInput, unknown, DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      user: 0,
      licenseNumber: '',
      licenseType: 'C',
      hireDate: '',
      experienceYears: 0,
      observations: '',
      isAvailable: 'true',
    },
  })

  useEffect(() => {
    if (driver) {
      reset({
        user: driver.user,
        licenseNumber: driver.licenseNumber,
        licenseType: driver.licenseType,
        hireDate: driver.hireDate,
        experienceYears: driver.experienceYears,
        observations: driver.observations,
        isAvailable: driver.isAvailable ? 'true' : 'false',
      })
    } else {
      reset({
        user: 0,
        licenseNumber: '',
        licenseType: 'C',
        hireDate: '',
        experienceYears: 0,
        observations: '',
        isAvailable: 'true',
      })
    }
  }, [driver, reset, open])

  async function onSubmit(values: DriverFormValues) {
    const dto = {
      user: values.user,
      licenseNumber: values.licenseNumber,
      licenseType: values.licenseType,
      hireDate: values.hireDate,
      experienceYears: values.experienceYears,
      observations: values.observations ?? '',
      isAvailable: values.isAvailable === 'true',
    }

    try {
      if (driver) {
        await updateDriver(driver.id, dto)
        toast.success('Conductor actualizado correctamente')
      } else {
        await createDriver(dto)
        toast.success('Conductor creado correctamente')
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
          <DialogTitle>{driver ? 'Editar conductor' : 'Nuevo conductor'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="user">ID de usuario existente</Label>
            <Input id="user" type="number" {...register('user')} />
            <p className="text-xs text-muted-foreground">
              Debe corresponder al ID de un usuario ya registrado en el sistema.
            </p>
            {errors.user && <p className="text-xs text-destructive">{errors.user.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="licenseNumber">Número de licencia</Label>
              <Input id="licenseNumber" {...register('licenseNumber')} />
              {errors.licenseNumber && (
                <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de licencia</Label>
              <Controller
                control={control}
                name="licenseType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseOptions.map((option) => (
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
              <Label htmlFor="hireDate">Fecha de contratación</Label>
              <Input id="hireDate" type="date" {...register('hireDate')} />
              {errors.hireDate && (
                <p className="text-xs text-destructive">{errors.hireDate.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="experienceYears">Años de experiencia</Label>
              <Input id="experienceYears" type="number" {...register('experienceYears')} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Disponibilidad</Label>
            <Controller
              control={control}
              name="isAvailable"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Disponible</SelectItem>
                    <SelectItem value="false">No disponible</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
