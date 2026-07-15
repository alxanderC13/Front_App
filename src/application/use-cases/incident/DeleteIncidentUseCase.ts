// src/application/use-cases/incident/DeleteIncidentUseCase.ts
import type { IncidentRepository } from '../../../domain/ports/IncidentRepository'

export class DeleteIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
