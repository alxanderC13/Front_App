// src/domain/ports/DriverAssignmentRepository.ts
import type { DriverAssignment } from '../entities/DriverAssignment'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface DriverAssignmentListParams {
  page?: number
}

export interface DriverAssignmentPayload {
  driver: number
  vehicle: number
  assignment_date: string
  end_date: string | null
  is_active_assignment: boolean
}

export interface DriverAssignmentRepository {
  list(params: DriverAssignmentListParams): Promise<PaginatedResult<DriverAssignment>>
  create(data: DriverAssignmentPayload): Promise<DriverAssignment>
  update(id: number, data: DriverAssignmentPayload): Promise<DriverAssignment>
  delete(id: number): Promise<void>
}
