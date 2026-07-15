// src/presentation/store/driver.store.ts
import { create } from 'zustand'
import type { Driver } from '../../domain/entities/Driver'
import type { DriverFormDto } from '../../application/dtos/DriverDto'
import {
  listDriversUseCase,
  createDriverUseCase,
  updateDriverUseCase,
  deleteDriverUseCase,
} from '../../infrastructure/factories/driver.factory'

interface DriverState {
  drivers: Driver[]
  count: number
  page: number
  search: string
  isLoading: boolean
  error: string | null

  fetchDrivers: () => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  createDriver: (dto: DriverFormDto) => Promise<void>
  updateDriver: (id: number, dto: DriverFormDto) => Promise<void>
  deleteDriver: (id: number) => Promise<void>
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  count: 0,
  page: 1,
  search: '',
  isLoading: false,
  error: null,

  fetchDrivers: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page, search } = get()
      const result = await listDriversUseCase.execute({ page, search })
      set({ drivers: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar conductores'
      set({ error: message, isLoading: false })
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchDrivers()
  },

  setSearch: (search: string) => {
    set({ search, page: 1 })
    get().fetchDrivers()
  },

  createDriver: async (dto: DriverFormDto) => {
    await createDriverUseCase.execute(dto)
    await get().fetchDrivers()
  },

  updateDriver: async (id: number, dto: DriverFormDto) => {
    await updateDriverUseCase.execute(id, dto)
    await get().fetchDrivers()
  },

  deleteDriver: async (id: number) => {
    await deleteDriverUseCase.execute(id)
    await get().fetchDrivers()
  },
}))
