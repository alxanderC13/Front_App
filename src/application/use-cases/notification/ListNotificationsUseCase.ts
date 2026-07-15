// src/application/use-cases/notification/ListNotificationsUseCase.ts
import type { NotificationRepository, NotificationListResult } from '../../../domain/ports/NotificationRepository'

export class ListNotificationsUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  execute(page?: number): Promise<NotificationListResult> {
    return this.repository.list(page)
  }
}
