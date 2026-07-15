// src/domain/ports/ProfileRepository.ts
import type { Profile } from '../entities/User'

export interface ProfileUpdatePayload {
  address: string
  emergency_contact: string
  emergency_phone: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
}

export interface ProfileRepository {
  updateProfile(data: ProfileUpdatePayload): Promise<Profile>
  changePassword(data: ChangePasswordPayload): Promise<void>
}
