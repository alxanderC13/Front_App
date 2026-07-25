// src/presentation/pages/auth/ResetPasswordPage.tsx
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()

  const [uid, setUid] = useState(searchParams.get('uid') ?? '')
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const confirmPasswordReset = useAuthStore((state) => state.confirmPasswordReset)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (newPassword !== newPassword2) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    try {
      await confirmPasswordReset(uid, token, newPassword, newPassword2)
      toast.success('Contraseña restablecida exitosamente')
      navigate('/login', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo restablecer la contraseña'
      setLocalError(message)
    }
  }

  return (
    <div className="auth-gradient-bg flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Restablecer contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="uid">Uid (del correo)</Label>
              <Input id="uid" type="text" value={uid} onChange={(e) => setUid(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="token">Token (del correo)</Label>
              <Input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword2">Confirmar nueva contraseña</Label>
              <Input
                id="newPassword2"
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            {localError && <p className="text-sm text-destructive">{localError}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Volver a iniciar sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
