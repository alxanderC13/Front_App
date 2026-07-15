// src/presentation/store/vehicle.store.ts
import { create } from 'zustand'
import type { Vehicle } from '../../domain/entities/Vehicle'
import type { Lookup } from '../../domain/entities/Lookup'
import type { VehicleFormDto } from '../../application/dtos/VehicleDto'
import {
  listVehiclesUseCase,
  createVehicleUseCase,
  updateVehicleUseCase,
  deleteVehicleUseCase,
} from '../../infrastructure/factories/vehicle.factory'
import {
  listVehicleTypesUseCase,
  listVehicleStatusesUseCase,
  listTransportCompaniesUseCase,
} from '../../infrastructure/factories/lookup.factory'

interface VehicleState {
  vehicles: Vehicle[]
  count: number
  page: number
  search: string
  isLoading: boolean
  error: string | null

  vehicleTypes: Lookup[]
  vehicleStatuses: Lookup[]
  transportCompanies: Lookup[]

  fetchVehicles: () => Promise<void>
  fetchLookups: () => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  createVehicle: (dto: VehicleFormDto) => Promise<void>
  updateVehicle: (id: number, dto: VehicleFormDto) => Promise<void>
  deleteVehicle: (id: number) => Promise<void>
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  count: 0,
  page: 1,
  search: '',
  isLoading: false,
  error: null,

  vehicleTypes: [],
  vehicleStatuses: [],
  transportCompanies: [],

  fetchVehicles: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page, search } = get()
      const result = await listVehiclesUseCase.execute({ page, search })
      set({ vehicles: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar vehículos'
      set({ error: message, isLoading: false })
    }
  },

  fetchLookups: async () => {
    try {
      const [vehicleTypes, vehicleStatuses, transportCompanies] = await Promise.all([
        listVehicleTypesUseCase.execute(),
        listVehicleStatusesUseCase.execute(),
        listTransportCompaniesUseCase.execute(),
      ])
      set({ vehicleTypes, vehicleStatuses, transportCompanies })
    } catch {
      // Los lookups no son críticos para ver el listado; fallan en silencio.
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchVehicles()
  },

  setSearch: (search: string) => {
    set({ search, page: 1 })
    get().fetchVehicles()
  },

  createVehicle: async (dto: VehicleFormDto) => {
    await createVehicleUseCase.execute(dto)
    await get().fetchVehicles()
  },

  updateVehicle: async (id: number, dto: VehicleFormDto) => {
    await updateVehicleUseCase.execute(id, dto)
    await get().fetchVehicles()
  },

  deleteVehicle: async (id: number) => {
    await deleteVehicleUseCase.execute(id)
    await get().fetchVehicles()
  },
}))
