// src/domain/ports/AuthRepository.ts
import type { User } from '../entities/User'

export interface AuthTokens {
  access: string
  refresh: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthTokens>
  register(data: RegisterPayload): Promise<void>
  getCurrentUser(): Promise<User>
  logout(): void
}
