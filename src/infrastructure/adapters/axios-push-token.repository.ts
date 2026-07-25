// src/infrastructure/adapters/axios-push-token.repository.ts
import type { PushTokenRepository } from '../../domain/ports/PushTokenRepository'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

export class AxiosPushTokenRepository implements PushTokenRepository {
  async registerToken(token: string, platform: string): Promise<void> {
    try {
      await axiosClient.post('/notifications/fcm-tokens/', { token, platform })
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
