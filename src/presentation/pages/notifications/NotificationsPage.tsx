// src/presentation/pages/notifications/NotificationsPage.tsx
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Bell, AlertTriangle, Info, CheckCheck } from 'lucide-react'
import type { Notification } from '../../../domain/entities/Notification'
import {
  listNotificationsUseCase,
  markNotificationReadUseCase,
  markAllNotificationsReadUseCase,
} from '../../../infrastructure/factories/notification.factory'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { cn } from '../../utils/cn'

const typeConfig: Record<Notification['type'], { icon: typeof Bell; label: string; className: string }> = {
  incident: { icon: AlertTriangle, label: 'Incidente', className: 'text-destructive' },
  warning: { icon: AlertTriangle, label: 'Advertencia', className: 'text-yellow-600' },
  system: { icon: Info, label: 'Sistema', className: 'text-primary' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  async function loadNotifications() {
    setIsLoading(true)
    try {
      const result = await listNotificationsUseCase.execute()
      setNotifications(result.results)
      setUnreadCount(result.unread_count)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar notificaciones'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function handleMarkRead(id: number) {
    try {
      await markNotificationReadUseCase.execute(id)
      await loadNotifications()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al marcar como leída'
      toast.error(message)
    }
  }

  async function handleMarkAllRead() {
    try {
      const count = await markAllNotificationsReadUseCase.execute()
      toast.success(`${count} notificación(es) marcadas como leídas`)
      await loadNotifications()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al marcar todas como leídas'
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {!isLoading && notifications.length === 0 && (
          <p className="text-center text-muted-foreground">No tienes notificaciones.</p>
        )}

        {!isLoading &&
          notifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon
            return (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-3 rounded-md border bg-background p-4',
                  !notification.isRead && 'border-primary/30 bg-primary/5',
                )}
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.className)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        Nueva
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => handleMarkRead(notification.id)}>
                    Marcar leída
                  </Button>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
