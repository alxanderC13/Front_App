// src/application/use-cases/notification/MarkAllNotificationsReadUseCase.ts
import type { NotificationRepository } from '../../../domain/ports/NotificationRepository'

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  execute(): Promise<number> {
    return this.repository.markAllAsRead()
  }
}
