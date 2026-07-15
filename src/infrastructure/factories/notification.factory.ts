// src/infrastructure/factories/notification.factory.ts
import { AxiosNotificationRepository } from '../adapters/axios-notification.repository'
import { ListNotificationsUseCase } from '../../application/use-cases/notification/ListNotificationsUseCase'
import { MarkNotificationReadUseCase } from '../../application/use-cases/notification/MarkNotificationReadUseCase'
import { MarkAllNotificationsReadUseCase } from '../../application/use-cases/notification/MarkAllNotificationsReadUseCase'

const notificationRepository = new AxiosNotificationRepository()

export const listNotificationsUseCase = new ListNotificationsUseCase(notificationRepository)
export const markNotificationReadUseCase = new MarkNotificationReadUseCase(notificationRepository)
export const markAllNotificationsReadUseCase = new MarkAllNotificationsReadUseCase(notificationRepository)
