// src/application/use-cases/driver-assignment/DeleteDriverAssignmentUseCase.ts
import type { DriverAssignmentRepository } from '../../../domain/ports/DriverAssignmentRepository'

export class DeleteDriverAssignmentUseCase {
  constructor(private readonly repository: DriverAssignmentRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
