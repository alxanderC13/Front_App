// src/application/dtos/IncidentDto.ts
import type { IncidentSeverity } from '../../domain/entities/Incident'

export interface IncidentFormDto {
  trip: number
  incidentType: number
  vehicle: number | null
  driver: number | null
  latitude: number
  longitude: number
  description: string
  severity: IncidentSeverity
}
