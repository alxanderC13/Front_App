// src/application/use-cases/incident/UpdateIncidentUseCase.ts
import type { IncidentRepository } from '../../../domain/ports/IncidentRepository'
import type { Incident } from '../../../domain/entities/Incident'
import type { IncidentFormDto } from '../../dtos/IncidentDto'

export class UpdateIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(id: number, dto: IncidentFormDto): Promise<Incident> {
    return this.repository.update(id, {
      trip: dto.trip,
      incident_type: dto.incidentType,
      vehicle: dto.vehicle,
      driver: dto.driver,
      latitude: dto.latitude,
      longitude: dto.longitude,
      description: dto.description,
      severity: dto.severity,
    })
  }
}
