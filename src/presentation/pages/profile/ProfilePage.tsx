// src/presentation/pages/profile/ProfilePage.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/auth.store'
import { updateProfileUseCase, changePasswordUseCase } from '../../../infrastructure/factories/profile.factory'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'

const profileSchema = z.object({
  address: z.string().max(255).optional().default(''),
  emergencyContact: z.string().max(120).optional().default(''),
  emergencyPhone: z.string().max(30).optional().default(''),
})
type ProfileFormValues = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin())
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      address: user?.profile?.address ?? '',
      emergencyContact: user?.profile?.emergencyContact ?? '',
      emergencyPhone: user?.profile?.emergencyPhone ?? '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onSubmitProfile(values: ProfileFormValues) {
    setIsSavingProfile(true)
    try {
      await updateProfileUseCase.execute({
        address: values.address ?? '',
        emergency_contact: values.emergencyContact ?? '',
        emergency_phone: values.emergencyPhone ?? '',
      })
      toast.success('Perfil actualizado correctamente')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el perfil'
      toast.error(message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  async function onSubmitPassword(values: PasswordFormValues) {
    try {
      await changePasswordUseCase.execute({
        old_password: values.oldPassword,
        new_password: values.newPassword,
      })
      toast.success('Contraseña actualizada correctamente')
      resetPassword()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar la contraseña'
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground">Datos de tu cuenta y contacto de emergencia</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de cuenta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Usuario</span>
            <span className="font-medium">{user?.username}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rol</span>
            <Badge variant="secondary">{isAdmin ? 'Administrator' : 'Usuario'}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" {...registerProfile('address')} />
              {profileErrors.address && (
                <p className="text-xs text-destructive">{profileErrors.address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                <Input id="emergencyContact" {...registerProfile('emergencyContact')} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
                <Input id="emergencyPhone" {...registerProfile('emergencyPhone')} />
              </div>
            </div>
            <Button type="submit" disabled={isSavingProfile} className="w-fit">
              {isSavingProfile ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="oldPassword">Contraseña actual</Label>
              <Input id="oldPassword" type="password" {...registerPassword('oldPassword')} />
              {passwordErrors.oldPassword && (
                <p className="text-xs text-destructive">{passwordErrors.oldPassword.message}</p>
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" {...registerPassword('newPassword')} />
              {passwordErrors.newPassword && (
                <p className="text-xs text-destructive">{passwordErrors.newPassword.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword')} />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-destructive">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isChangingPassword} className="w-fit">
              {isChangingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
