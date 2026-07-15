// src/presentation/store/driver-assignment.store.ts
import { create } from 'zustand'
import type { DriverAssignment } from '../../domain/entities/DriverAssignment'
import type { ReferenceOption } from '../../domain/ports/ReferenceDataRepository'
import type { DriverAssignmentFormDto } from '../../application/dtos/DriverAssignmentDto'
import {
  listDriverAssignmentsUseCase,
  createDriverAssignmentUseCase,
  updateDriverAssignmentUseCase,
  deleteDriverAssignmentUseCase,
} from '../../infrastructure/factories/driver-assignment.factory'
import { referenceDataRepository } from '../../infrastructure/factories/reference-data.factory'

interface DriverAssignmentState {
  assignments: DriverAssignment[]
  count: number
  page: number
  isLoading: boolean
  error: string | null

  driverOptions: ReferenceOption[]
  vehicleOptions: ReferenceOption[]

  fetchAssignments: () => Promise<void>
  fetchOptions: () => Promise<void>
  setPage: (page: number) => void
  createAssignment: (dto: DriverAssignmentFormDto) => Promise<void>
  updateAssignment: (id: number, dto: DriverAssignmentFormDto) => Promise<void>
  deleteAssignment: (id: number) => Promise<void>
}

export const useDriverAssignmentStore = create<DriverAssignmentState>((set, get) => ({
  assignments: [],
  count: 0,
  page: 1,
  isLoading: false,
  error: null,

  driverOptions: [],
  vehicleOptions: [],

  fetchAssignments: async () => {
    set({ isLoading: true, error: null })
    try {
      const { page } = get()
      const result = await listDriverAssignmentsUseCase.execute({ page })
      set({ assignments: result.results, count: result.count, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar asignaciones'
      set({ error: message, isLoading: false })
    }
  },

  fetchOptions: async () => {
    try {
      const [driverOptions, vehicleOptions] = await Promise.all([
        referenceDataRepository.listDriverOptions(),
        referenceDataRepository.listVehicleOptions(),
      ])
      set({ driverOptions, vehicleOptions })
    } catch {
      // no crítico
    }
  },

  setPage: (page: number) => {
    set({ page })
    get().fetchAssignments()
  },

  createAssignment: async (dto: DriverAssignmentFormDto) => {
    await createDriverAssignmentUseCase.execute(dto)
    await get().fetchAssignments()
  },

  updateAssignment: async (id: number, dto: DriverAssignmentFormDto) => {
    await updateDriverAssignmentUseCase.execute(id, dto)
    await get().fetchAssignments()
  },

  deleteAssignment: async (id: number) => {
    await deleteDriverAssignmentUseCase.execute(id)
    await get().fetchAssignments()
  },
}))
