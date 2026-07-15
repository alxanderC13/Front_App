// src/presentation/store/incident.store.ts
import { create } from 'zustand'
import type { Incident } from '../../domain/entities/Incident'
import type { Lookup } from '../../domain/entities/Lookup'
import type { ReferenceOption } from '../../domain/ports/ReferenceDataRepository'
import type { IncidentFormDto } from '../../application/dtos/IncidentDto'
import {
  listIncidentsUseCase,
  createIncidentUseCase,
  updateIncidentUseCase,
  resolveIncidentUseCase,
  deleteIncidentUseCase,
  listIncidentTypesUseCase,
} from '../../infrastructure/factories/incident.factory'
import { referenceDataRepository } from '../../infrastructure/factories/reference-data.factory'

interface IncidentState {
  incidents: Incident[]
  count: number
  page: number
  isLoading: boolean
  error: string | null

  incidentTypes: Lookup[]
  tripOptions: ReferenceOption[]
  vehicleOptions: ReferenceOption[]
  driverOptions: ReferenceOption[]

  fetchIncidents: () => Promise<void>
  fetchOptions: () => Promise<void>
  setPage: (page: number) => void
  createIncident: (dto: IncidentFormDto) => Promise<void>
  updateIncident: (id: number, dto: IncidentFormDto) => Promise<void>
  resolveIncident: (id: number) => Promise<void>
  deleteIncident: (id: number) => Promise<void>
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  count: 0,
  page: 1,
  isLoading: false,
  error: null,

  incidentTypes: [],
  tripOptions: [],
  vehicleOptions: [],
  driverOptions: [],

  fetchIncidents: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page } = get()
      const result = await listIncidentsUseCase.execute({ page })
      set({ incidents: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar incidentes'
      set({ error: message, isLoading: false })
    }
  },

  fetchOptions: async () => {
    try {
      const [incidentTypes, tripOptions, vehicleOptions, driverOptions] = await Promise.all([
        listIncidentTypesUseCase.execute(),
        referenceDataRepository.listTripOptions(),
        referenceDataRepository.listVehicleOptions(),
        referenceDataRepository.listDriverOptions(),
      ])
      set({ incidentTypes, tripOptions, vehicleOptions, driverOptions })
    } catch {
      // no crítico
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchIncidents()
  },

  createIncident: async (dto: IncidentFormDto) => {
    await createIncidentUseCase.execute(dto)
    await get().fetchIncidents()
  },

  updateIncident: async (id: number, dto: IncidentFormDto) => {
    await updateIncidentUseCase.execute(id, dto)
    await get().fetchIncidents()
  },

  resolveIncident: async (id: number) => {
    await resolveIncidentUseCase.execute(id)
    await get().fetchIncidents()
  },

  deleteIncident: async (id: number) => {
    await deleteIncidentUseCase.execute(id)
    await get().fetchIncidents()
  },
}))
