// src/application/use-cases/notification/MarkNotificationReadUseCase.ts
import type { NotificationRepository } from '../../../domain/ports/NotificationRepository'
import type { Notification } from '../../../domain/entities/Notification'

export class MarkNotificationReadUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  execute(id: number): Promise<Notification> {
    return this.repository.markAsRead(id)
  }
}
