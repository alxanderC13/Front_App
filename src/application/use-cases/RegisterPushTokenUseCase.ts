// src/application/use-cases/RegisterPushTokenUseCase.ts
import type { PushTokenRepository } from '../../domain/ports/PushTokenRepository'

export class RegisterPushTokenUseCase {
  constructor(private readonly repository: PushTokenRepository) {}

  execute(token: string, platform: string): Promise<void> {
    return this.repository.registerToken(token, platform)
  }
}
