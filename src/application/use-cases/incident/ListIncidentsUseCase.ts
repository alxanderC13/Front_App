// src/application/use-cases/incident/ListIncidentsUseCase.ts
import type { IncidentRepository, IncidentListParams } from '../../../domain/ports/IncidentRepository'
import type { Incident } from '../../../domain/entities/Incident'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListIncidentsUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(params: IncidentListParams): Promise<PaginatedResult<Incident>> {
    return this.repository.list(params)
  }
}
