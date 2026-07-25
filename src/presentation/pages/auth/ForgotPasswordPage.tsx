// src/presentation/pages/auth/ForgotPasswordPage.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/auth.store'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset)
  const isLoading = useAuthStore((state) => state.isLoading)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)
    try {
      await requestPasswordReset(email)
      setSent(true)
      toast.success('Revisa tu correo para restablecer la contraseña')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo enviar el enlace'
      setLocalError(message)
    }
  }

  return (
    <div className="auth-gradient-bg flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Recuperar contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu
                contraseña.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Volver a iniciar sesión
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu
                contraseña.
              </p>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              {localError && <p className="text-sm text-destructive">{localError}</p>}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Volver a iniciar sesión
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
