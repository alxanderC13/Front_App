// src/application/use-cases/RequestPasswordResetUseCase.ts
import type { AuthRepository } from '../../domain/ports/AuthRepository'

export class RequestPasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string): Promise<void> {
    return this.authRepository.requestPasswordReset(email)
  }
}
