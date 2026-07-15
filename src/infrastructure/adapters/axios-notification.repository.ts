// src/infrastructure/adapters/axios-notification.repository.ts
import type {
  NotificationRepository,
  NotificationListResult,
} from '../../domain/ports/NotificationRepository'
import type { Notification, NotificationType } from '../../domain/entities/Notification'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface NotificationApiResponse {
  id: number
  user: number
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
  updated_at: string
}

function mapNotification(data: NotificationApiResponse): Notification {
  return {
    id: data.id,
    user: data.user,
    title: data.title,
    message: data.message,
    type: data.type,
    isRead: data.is_read,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosNotificationRepository implements NotificationRepository {
  async list(page?: number): Promise<NotificationListResult> {
    try {
      const { data } = await axiosClient.get<{
        count: number
        next: string | null
        previous: string | null
        results: NotificationApiResponse[]
        unread_count: number
      }>('/notifications/notifications/', { params: { page } })
      return {
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: data.results.map(mapNotification),
        unread_count: data.unread_count,
      }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async markAsRead(id: number): Promise<Notification> {
    try {
      const { data } = await axiosClient.patch<NotificationApiResponse>(
        `/notifications/notifications/${id}/read/`,
      )
      return mapNotification(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async markAllAsRead(): Promise<number> {
    try {
      const { data } = await axiosClient.put<{ marked_read: number }>(
        '/notifications/notifications/read_all/',
      )
      return data.marked_read
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
