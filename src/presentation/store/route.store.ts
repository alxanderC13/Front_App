// src/presentation/store/route.store.ts
import { create } from 'zustand'
import type { RouteEntity } from '../../domain/entities/RouteEntity'
import type { Lookup } from '../../domain/entities/Lookup'
import type { RouteFormDto } from '../../application/dtos/RouteDto'
import {
  listRoutesUseCase,
  createRouteUseCase,
  updateRouteUseCase,
  deleteRouteUseCase,
} from '../../infrastructure/factories/route.factory'
import { listTransportCompaniesUseCase } from '../../infrastructure/factories/lookup.factory'

interface RouteState {
  routes: RouteEntity[]
  count: number
  page: number
  search: string
  isLoading: boolean
  error: string | null

  transportCompanies: Lookup[]

  fetchRoutes: () => Promise<void>
  fetchLookups: () => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  createRoute: (dto: RouteFormDto) => Promise<void>
  updateRoute: (id: number, dto: RouteFormDto) => Promise<void>
  deleteRoute: (id: number) => Promise<void>
}

export const useRouteStore = create<RouteState>((set, get) => ({
  routes: [],
  count: 0,
  page: 1,
  search: '',
  isLoading: false,
  error: null,

  transportCompanies: [],

  fetchRoutes: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page, search } = get()
      const result = await listRoutesUseCase.execute({ page, search })
      set({ routes: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar rutas'
      set({ error: message, isLoading: false })
    }
  },

  fetchLookups: async () => {
    try {
      const transportCompanies = await listTransportCompaniesUseCase.execute()
      set({ transportCompanies })
    } catch {
      // no crítico
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchRoutes()
  },

  setSearch: (search: string) => {
    set({ search, page: 1 })
    get().fetchRoutes()
  },

  createRoute: async (dto: RouteFormDto) => {
    await createRouteUseCase.execute(dto)
    await get().fetchRoutes()
  },

  updateRoute: async (id: number, dto: RouteFormDto) => {
    await updateRouteUseCase.execute(id, dto)
    await get().fetchRoutes()
  },

  deleteRoute: async (id: number) => {
    await deleteRouteUseCase.execute(id)
    await get().fetchRoutes()
  },
}))
