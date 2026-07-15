// src/application/use-cases/LoginUseCase.ts
import type { AuthRepository } from '../../domain/ports/AuthRepository'
import type { LoginDto } from '../dtos/LoginDto'
import type { User } from '../../domain/entities/User'

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: LoginDto): Promise<User> {
    await this.authRepository.login(dto.username, dto.password)
    return this.authRepository.getCurrentUser()
  }
}

