// src/presentation/pages/contact/ContactPage.tsx
import { Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Contacto</h1>
      <p className="mb-8 text-muted-foreground">
        Proyecto académico — Sistema de Gestión de Transporte QuitoMove
      </p>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <span>contacto@quitomove.ec</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <span>+593 2 000 0000</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Quito, Ecuador</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
