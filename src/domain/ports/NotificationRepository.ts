// src/domain/ports/NotificationRepository.ts
import type { Notification } from '../entities/Notification'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface NotificationListResult extends PaginatedResult<Notification> {
  unread_count: number
}

export interface NotificationRepository {
  list(page?: number): Promise<NotificationListResult>
  markAsRead(id: number): Promise<Notification>
  markAllAsRead(): Promise<number>
}
