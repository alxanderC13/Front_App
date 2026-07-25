// src/application/use-cases/ConfirmPasswordResetUseCase.ts
import type { AuthRepository } from '../../domain/ports/AuthRepository'

export class ConfirmPasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(uid: string, token: string, newPassword: string, newPassword2: string): Promise<void> {
    return this.authRepository.confirmPasswordReset(uid, token, newPassword, newPassword2)
  }
}
