// src/application/use-cases/driver-assignment/ListDriverAssignmentsUseCase.ts
import type {
  DriverAssignmentRepository,
  DriverAssignmentListParams,
} from '../../../domain/ports/DriverAssignmentRepository'
import type { DriverAssignment } from '../../../domain/entities/DriverAssignment'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListDriverAssignmentsUseCase {
  constructor(private readonly repository: DriverAssignmentRepository) {}

  execute(params: DriverAssignmentListParams): Promise<PaginatedResult<DriverAssignment>> {
    return this.repository.list(params)
  }
}
