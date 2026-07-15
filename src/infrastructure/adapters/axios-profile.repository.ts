// src/infrastructure/adapters/axios-profile.repository.ts
import type {
  ProfileRepository,
  ProfileUpdatePayload,
  ChangePasswordPayload,
} from '../../domain/ports/ProfileRepository'
import type { Profile } from '../../domain/entities/User'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface ProfileApiResponse {
  avatar_url: string | null
  address: string | null
  emergency_contact: string | null
  emergency_phone: string | null
}

function mapProfile(data: ProfileApiResponse): Profile {
  return {
    avatarUrl: data.avatar_url,
    address: data.address,
    emergencyContact: data.emergency_contact,
    emergencyPhone: data.emergency_phone,
  }
}

export class AxiosProfileRepository implements ProfileRepository {
  async updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
    try {
      const { data } = await axiosClient.patch<ProfileApiResponse>('/auth/profile/', payload)
      return mapProfile(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      await axiosClient.post('/auth/change-password/', payload)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
