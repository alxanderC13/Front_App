// src/application/use-cases/incident/CreateIncidentUseCase.ts
import type { IncidentRepository } from '../../../domain/ports/IncidentRepository'
import type { Incident } from '../../../domain/entities/Incident'
import type { IncidentFormDto } from '../../dtos/IncidentDto'

export class CreateIncidentUseCase {
  constructor(private readonly repository: IncidentRepository) {}

  execute(dto: IncidentFormDto): Promise<Incident> {
    return this.repository.create({
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
