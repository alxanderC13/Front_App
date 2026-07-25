// src/presentation/store/notification-badge.store.ts
import { create } from 'zustand'
import { listNotificationsUseCase } from '../../infrastructure/factories/notification.factory'

interface NotificationBadgeState {
  unreadCount: number
  fetchUnreadCount: () => Promise<void>
}

export const useNotificationBadgeStore = create<NotificationBadgeState>((set) => ({
  unreadCount: 0,
  fetchUnreadCount: async () => {
    try {
      const result = await listNotificationsUseCase.execute()
      set({ unreadCount: result.unread_count })
    } catch {
      // silencioso: si falla, no mostramos badge, no es crítico
    }
  },
}))
