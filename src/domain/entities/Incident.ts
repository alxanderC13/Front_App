// src/domain/entities/Incident.ts

export type IncidentSeverity = 'low' | 'medium' | 'high'
export type IncidentStatus = 'open' | 'in_progress' | 'resolved'

export interface Incident {
  id: number
  trip: number
  tripInfo: string
  incidentType: number
  incidentTypeName: string
  vehicle: number | null
  driver: number | null
  latitude: number
  longitude: number
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  resolvedAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
