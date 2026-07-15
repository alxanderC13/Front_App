// src/application/use-cases/driver-assignment/UpdateDriverAssignmentUseCase.ts
import type { DriverAssignmentRepository } from '../../../domain/ports/DriverAssignmentRepository'
import type { DriverAssignment } from '../../../domain/entities/DriverAssignment'
import type { DriverAssignmentFormDto } from '../../dtos/DriverAssignmentDto'

export class UpdateDriverAssignmentUseCase {
  constructor(private readonly repository: DriverAssignmentRepository) {}

  execute(id: number, dto: DriverAssignmentFormDto): Promise<DriverAssignment> {
    return this.repository.update(id, {
      driver: dto.driver,
      vehicle: dto.vehicle,
      assignment_date: dto.assignmentDate,
      end_date: dto.endDate,
      is_active_assignment: dto.isActiveAssignment,
    })
  }
}
