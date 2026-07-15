// src/domain/entities/Notification.ts

export type NotificationType = 'incident' | 'system' | 'warning'

export interface Notification {
  id: number
  user: number
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: string
  updatedAt: string
}
