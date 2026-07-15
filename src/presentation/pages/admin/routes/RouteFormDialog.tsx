// src/presentation/pages/admin/routes/RouteFormDialog.tsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { RouteEntity } from '../../../../domain/entities/RouteEntity'
import { useRouteStore } from '../../../store/route.store'
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

const routeSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(20),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().max(1000).optional().default(''),
  transportCompany: z.string().nullable(),
})

type RouteFormValues = z.infer<typeof routeSchema>

interface RouteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  route: RouteEntity | null
}

export default function RouteFormDialog({ open, onOpenChange, route }: RouteFormDialogProps) {
  const { transportCompanies, createRoute, updateRoute } = useRouteStore()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      transportCompany: null,
    },
  })

  useEffect(() => {
    if (route) {
      reset({
        code: route.code,
        name: route.name,
        description: route.description,
        transportCompany: route.transportCompany ? String(route.transportCompany) : null,
      })
    } else {
      reset({ code: '', name: '', description: '', transportCompany: null })
    }
  }, [route, reset, open])

  async function onSubmit(values: RouteFormValues) {
    const dto = {
      code: values.code,
      name: values.name,
      description: values.description ?? '',
      transportCompany: values.transportCompany ? Number(values.transportCompany) : null,
    }

    try {
      if (route) {
        await updateRoute(route.id, dto)
        toast.success('Ruta actualizada correctamente')
      } else {
        await createRoute(dto)
        toast.success('Ruta creada correctamente')
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
          <DialogTitle>{route ? 'Editar ruta' : 'Nueva ruta'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" {...register('code')} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={3} {...register('description')} />
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
