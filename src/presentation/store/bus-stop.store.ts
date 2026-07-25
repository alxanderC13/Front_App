// src/presentation/store/bus-stop.store.ts
import { create } from 'zustand'
import type { BusStop } from '../../domain/entities/BusStop'
import type { Lookup } from '../../domain/entities/Lookup'
import type { BusStopFormDto } from '../../application/dtos/BusStopDto'
import {
  listBusStopsUseCase,
  createBusStopUseCase,
  updateBusStopUseCase,
  deleteBusStopUseCase,
  listSectorsUseCase,
} from '../../infrastructure/factories/bus-stop.factory'

interface BusStopState {
  busStops: BusStop[]
  count: number
  page: number
  search: string
  isLoading: boolean
  error: string | null

  sectors: Lookup[]

  fetchBusStops: () => Promise<void>
  fetchSectors: () => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  createBusStop: (dto: BusStopFormDto) => Promise<void>
  updateBusStop: (id: number, dto: BusStopFormDto) => Promise<void>
  deleteBusStop: (id: number) => Promise<void>
}

export const useBusStopStore = create<BusStopState>((set, get) => ({
  busStops: [],
  count: 0,
  page: 1,
  search: '',
  isLoading: false,
  error: null,

  sectors: [],

  fetchBusStops: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page, search } = get()
      const result = await listBusStopsUseCase.execute({ page, search })
      set({ busStops: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar paradas'
      set({ error: message, isLoading: false })
    }
  },

  fetchSectors: async () => {
    try {
      const sectors = await listSectorsUseCase.execute()
      set({ sectors })
    } catch {
      // no crítico
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchBusStops()
  },

  setSearch: (search: string) => {
    set({ search, page: 1 })
    get().fetchBusStops()
  },

  createBusStop: async (dto: BusStopFormDto) => {
    await createBusStopUseCase.execute(dto)
    await get().fetchBusStops()
  },

  updateBusStop: async (id: number, dto: BusStopFormDto) => {
    await updateBusStopUseCase.execute(id, dto)
    await get().fetchBusStops()
  },

  deleteBusStop: async (id: number) => {
    await deleteBusStopUseCase.execute(id)
    await get().fetchBusStops()
  },
}))
