// src/domain/ports/PushTokenRepository.ts

export interface PushTokenRepository {
  registerToken(token: string, platform: string): Promise<void>
}
