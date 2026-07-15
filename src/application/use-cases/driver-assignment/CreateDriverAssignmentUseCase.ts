// src/application/use-cases/driver-assignment/CreateDriverAssignmentUseCase.ts
import type { DriverAssignmentRepository } from '../../../domain/ports/DriverAssignmentRepository'
import type { DriverAssignment } from '../../../domain/entities/DriverAssignment'
import type { DriverAssignmentFormDto } from '../../dtos/DriverAssignmentDto'

export class CreateDriverAssignmentUseCase {
  constructor(private readonly repository: DriverAssignmentRepository) {}

  execute(dto: DriverAssignmentFormDto): Promise<DriverAssignment> {
    return this.repository.create({
      driver: dto.driver,
      vehicle: dto.vehicle,
      assignment_date: dto.assignmentDate,
      end_date: dto.endDate,
      is_active_assignment: dto.isActiveAssignment,
    })
  }
}
