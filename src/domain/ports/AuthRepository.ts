// src/domain/ports/AuthRepository.ts
import type { User } from '../entities/User'

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthRepository {
  login(username: string, password: string): Promise<AuthTokens>
  getCurrentUser(): Promise<User>
  logout(): void
}
