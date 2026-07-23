// src/application/use-cases/RegisterUseCase.ts
import type { AuthRepository } from '../../domain/ports/AuthRepository'
import type { RegisterDto } from '../dtos/RegisterDto'

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(dto: RegisterDto): Promise<void> {
    return this.authRepository.register(dto)
  }
}
