// src/presentation/store/trip.store.ts
import { create } from 'zustand'
import type { Trip } from '../../domain/entities/Trip'
import type { ReferenceOption } from '../../domain/ports/ReferenceDataRepository'
import type { TripFormDto } from '../../application/dtos/TripDto'
import {
  listTripsUseCase,
  createTripUseCase,
  updateTripUseCase,
  deleteTripUseCase,
} from '../../infrastructure/factories/trip.factory'
import { referenceDataRepository } from '../../infrastructure/factories/reference-data.factory'

interface TripState {
  trips: Trip[]
  count: number
  page: number
  isLoading: boolean
  error: string | null

  routeOptions: ReferenceOption[]
  vehicleOptions: ReferenceOption[]
  driverOptions: ReferenceOption[]

  fetchTrips: () => Promise<void>
  fetchOptions: () => Promise<void>
  setPage: (page: number) => void
  createTrip: (dto: TripFormDto) => Promise<void>
  updateTrip: (id: number, dto: TripFormDto) => Promise<void>
  deleteTrip: (id: number) => Promise<void>
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  count: 0,
  page: 1,
  isLoading: false,
  error: null,

  routeOptions: [],
  vehicleOptions: [],
  driverOptions: [],

  fetchTrips: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page } = get()
      const result = await listTripsUseCase.execute({ page })
      set({ trips: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar viajes'
      set({ error: message, isLoading: false })
    }
  },

  fetchOptions: async () => {
    try {
      const [routeOptions, vehicleOptions, driverOptions] = await Promise.all([
        referenceDataRepository.listRouteOptions(),
        referenceDataRepository.listVehicleOptions(),
        referenceDataRepository.listDriverOptions(),
      ])
      set({ routeOptions, vehicleOptions, driverOptions })
    } catch {
      // no crítico
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchTrips()
  },

  createTrip: async (dto: TripFormDto) => {
    await createTripUseCase.execute(dto)
    await get().fetchTrips()
  },

  updateTrip: async (id: number, dto: TripFormDto) => {
    await updateTripUseCase.execute(id, dto)
    await get().fetchTrips()
  },

  deleteTrip: async (id: number) => {
    await deleteTripUseCase.execute(id)
    await get().fetchTrips()
  },
}))
