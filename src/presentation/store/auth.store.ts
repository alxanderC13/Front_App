// src/presentation/store/auth.store.ts
import { create } from 'zustand'
import type { User } from '../../domain/entities/User'
import { loginUseCase, registerUseCase, getCurrentUserUseCase, logoutUseCase } from '../../infrastructure/factories/auth.factory'
import { localTokenStorage } from '../../infrastructure/storage/local-token-storage'
import { isAdministrator } from '../../domain/enums/Role'

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitializing: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadCurrentUser: () => Promise<void>
  isAuthenticated: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const user = await loginUseCase.execute({ username, password })
      set({ user, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      await registerUseCase.execute({ username, email, password })
      set({ isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse'
      set({ error: message, isLoading: false })
      throw err
    }
  },
  logout: () => {
    logoutUseCase.execute()
    set({ user: null })
  },

  loadCurrentUser: async () => {
    const token = localTokenStorage.getAccessToken()
    if (!token) {
      set({ isInitializing: false })
      return
    }
    try {
      const user = await getCurrentUserUseCase.execute()
      set({ user, isInitializing: false })
    } catch {
      localTokenStorage.clear()
      set({ user: null, isInitializing: false })
    }
  },

  isAuthenticated: () => get().user !== null,
  isAdmin: () => {
    const user = get().user
    return user ? isAdministrator(user.groups) : false
  },
}))
