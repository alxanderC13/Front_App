// src/application/use-cases/GetCurrentUserUseCase.ts
import type { AuthRepository } from '../../domain/ports/AuthRepository'
import type { User } from '../../domain/entities/User'

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.getCurrentUser()
  }
}
