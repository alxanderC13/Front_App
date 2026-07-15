// src/application/use-cases/incident/ResolveIncidentUseCase.ts
import type { IncidentRepository } from '../../../domain/ports/IncidentRepository'
import type { Incident } from '../../../domain/entities/Incident'

export class ResolveIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(id: number): Promise<Incident> {
    return this.repository.resolve(id)
  }
}
