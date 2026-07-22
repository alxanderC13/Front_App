  // src/presentation/pages/admin/assignments/DriverAssignmentFormDialog.tsx
  import { useEffect } from 'react'
  import { useForm, Controller } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { z } from 'zod'
  import { toast } from 'sonner'
  import type { DriverAssignment } from '../../../../domain/entities/DriverAssignment'
  import { useDriverAssignmentStore } from '../../../store/driver-assignment.store'
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

  const assignmentSchema = z.object({
    driver: z.string().min(1, 'Selecciona un conductor'),
    vehicle: z.string().min(1, 'Selecciona un vehículo'),
    assignmentDate: z.string().min(1, 'La fecha es requerida'),
    endDate: z.string().optional().default(''),
    isActiveAssignment: z.enum(['true', 'false']),
  })

  type AssignmentFormInput = z.input<typeof assignmentSchema>
  type AssignmentFormOutput = z.output<typeof assignmentSchema>

  interface DriverAssignmentFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignment: DriverAssignment | null
  }

  export default function DriverAssignmentFormDialog({
    open,
    onOpenChange,
    assignment,
  }: DriverAssignmentFormDialogProps) {
    const { driverOptions, vehicleOptions, createAssignment, updateAssignment } =
      useDriverAssignmentStore()

    const {
      register,
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<AssignmentFormInput, unknown, AssignmentFormOutput>({
      resolver: zodResolver(assignmentSchema),
      defaultValues: {
        driver: '',
        vehicle: '',
        assignmentDate: '',
        endDate: '',
        isActiveAssignment: 'true',
      },
    })

    useEffect(() => {
      if (assignment) {
        reset({
          driver: String(assignment.driver),
          vehicle: String(assignment.vehicle),
          assignmentDate: assignment.assignmentDate,
          endDate: assignment.endDate ?? '',
          isActiveAssignment: assignment.isActiveAssignment ? 'true' : 'false',
        })
      } else {
        reset({
          driver: '',
          vehicle: '',
          assignmentDate: '',
          endDate: '',
          isActiveAssignment: 'true',
        })
      }
    }, [assignment, reset, open])

    async function onSubmit(values: AssignmentFormOutput) {
      const dto = {
        driver: Number(values.driver),
        vehicle: Number(values.vehicle),
        assignmentDate: values.assignmentDate,
        endDate: values.endDate || null,
        isActiveAssignment: values.isActiveAssignment === 'true',
      }

      try {
        if (assignment) {
          await updateAssignment(assignment.id, dto)
          toast.success('Asignación actualizada correctamente')
        } else {
          await createAssignment(dto)
          toast.success('Asignación creada correctamente')
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
            <DialogTitle>{assignment ? 'Editar asignación' : 'Nueva asignación'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Conductor</Label>
              <Controller
                control={control}
                name="driver"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un conductor" />
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
              {errors.driver && <p className="text-xs text-destructive">{errors.driver.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Vehículo</Label>
              <Controller
                control={control}
                name="vehicle"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un vehículo" />
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
              {errors.vehicle && <p className="text-xs text-destructive">{errors.vehicle.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="assignmentDate">Fecha de asignación</Label>
                <Input id="assignmentDate" type="date" {...register('assignmentDate')} />
                {errors.assignmentDate && (
                  <p className="text-xs text-destructive">{errors.assignmentDate.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">Fecha de fin (opcional)</Label>
                <Input id="endDate" type="date" {...register('endDate')} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>¿Asignación activa?</Label>
              <Controller
                control={control}
                name="isActiveAssignment"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Sí, activa</SelectItem>
                      <SelectItem value="false">No, finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Solo puede existir una asignación activa por vehículo.
              </p>
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
