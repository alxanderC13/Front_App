// src/application/use-cases/profile/UpdateProfileUseCase.ts
import type { ProfileRepository, ProfileUpdatePayload } from '../../../domain/ports/ProfileRepository'
import type { Profile } from '../../../domain/entities/User'

export class UpdateProfileUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  execute(data: ProfileUpdatePayload): Promise<Profile> {
    return this.repository.updateProfile(data)
  }
}
