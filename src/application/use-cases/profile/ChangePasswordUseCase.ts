// src/application/use-cases/profile/ChangePasswordUseCase.ts
import type { ProfileRepository, ChangePasswordPayload } from '../../../domain/ports/ProfileRepository'

export class ChangePasswordUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(data: ChangePasswordPayload): Promise<void> {
    return this.repository.changePassword(data)
  }
}
