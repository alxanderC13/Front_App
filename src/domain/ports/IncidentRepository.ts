// src/domain/ports/IncidentRepository.ts
import type { Incident, IncidentSeverity, IncidentStatus } from '../entities/Incident'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface IncidentListParams {
  page?: number
  search?: string
  severity?: IncidentSeverity
  status?: IncidentStatus
}

export interface IncidentPayload {
  trip: number
  incident_type: number
  vehicle: number | null
  driver: number | null
  latitude: number
  longitude: number
  description: string
  severity: IncidentSeverity
}

export interface IncidentRepository {
  list(params: IncidentListParams): Promise<PaginatedResult<Incident>>
  create(data: IncidentPayload): Promise<Incident>
  update(id: number, data: IncidentPayload): Promise<Incident>
  resolve(id: number): Promise<Incident>
  delete(id: number): Promise<void>
}
