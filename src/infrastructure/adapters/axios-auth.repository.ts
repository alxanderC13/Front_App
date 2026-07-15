// src/infrastructure/adapters/axios-auth.repository.ts
import type { AuthRepository, AuthTokens } from '../../domain/ports/AuthRepository'
import type { User } from '../../domain/entities/User'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'
import { localTokenStorage } from '../storage/local-token-storage'

interface UserApiResponse {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  is_active: boolean
  groups: string[]
  date_joined: string
  profile: {
    avatar_url: string | null
    address: string | null
    emergency_contact: string | null
    emergency_phone: string | null
  } | null
}

function mapUser(data: UserApiResponse): User {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    isActive: data.is_active,
    groups: data.groups,
    dateJoined: data.date_joined,
    profile: data.profile
      ? {
          avatarUrl: data.profile.avatar_url,
          address: data.profile.address,
          emergencyContact: data.profile.emergency_contact,
          emergencyPhone: data.profile.emergency_phone,
        }
      : null,
  }
}

export class AxiosAuthRepository implements AuthRepository {
  async login(username: string, password: string): Promise<AuthTokens> {
    try {
      const { data } = await axiosClient.post<AuthTokens>('/auth/login/', {
        username,
        password,
      })
      localTokenStorage.setTokens(data.access, data.refresh)
      return data
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await axiosClient.get<UserApiResponse>('/auth/me/')
      return mapUser(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  logout(): void {
    localTokenStorage.clear()
  }
}
