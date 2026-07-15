// src/application/use-cases/LogoutUseCase.ts
import type { AuthRepository } from '../../domain/ports/AuthRepository'

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): void {
    this.authRepository.logout()
  }
}
