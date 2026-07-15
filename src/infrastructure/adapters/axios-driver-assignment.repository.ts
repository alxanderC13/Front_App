// src/infrastructure/adapters/axios-driver-assignment.repository.ts
import type {
  DriverAssignmentRepository,
  DriverAssignmentListParams,
  DriverAssignmentPayload,
} from '../../domain/ports/DriverAssignmentRepository'
import type { DriverAssignment } from '../../domain/entities/DriverAssignment'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface DriverAssignmentApiResponse {
  id: number
  driver: number
  driver_name: string
  vehicle: number
  vehicle_plate: string
  assignment_date: string
  end_date: string | null
  is_active_assignment: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapAssignment(data: DriverAssignmentApiResponse): DriverAssignment {
  return {
    id: data.id,
    driver: data.driver,
    driverName: data.driver_name,
    vehicle: data.vehicle,
    vehiclePlate: data.vehicle_plate,
    assignmentDate: data.assignment_date,
    endDate: data.end_date,
    isActiveAssignment: data.is_active_assignment,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosDriverAssignmentRepository implements DriverAssignmentRepository {
  async list(params: DriverAssignmentListParams): Promise<PaginatedResult<DriverAssignment>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<DriverAssignmentApiResponse>>(
        '/operations/driver-assignments/',
        { params: { page: params.page } },
      )
      return { ...data, results: data.results.map(mapAssignment) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: DriverAssignmentPayload): Promise<DriverAssignment> {
    try {
      const { data } = await axiosClient.post<DriverAssignmentApiResponse>(
        '/operations/driver-assignments/',
        payload,
      )
      return mapAssignment(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: DriverAssignmentPayload): Promise<DriverAssignment> {
    try {
      const { data } = await axiosClient.patch<DriverAssignmentApiResponse>(
        `/operations/driver-assignments/${id}/`,
        payload,
      )
      return mapAssignment(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/operations/driver-assignments/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
