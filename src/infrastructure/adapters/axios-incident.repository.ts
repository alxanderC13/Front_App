// src/infrastructure/adapters/axios-incident.repository.ts
import type {
  IncidentRepository,
  IncidentListParams,
  IncidentPayload,
} from '../../domain/ports/IncidentRepository'
import type { Incident, IncidentSeverity, IncidentStatus } from '../../domain/entities/Incident'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface IncidentApiResponse {
  id: number
  trip: number
  trip_info: string
  incident_type: number
  incident_type_name: string
  vehicle: number | null
  driver: number | null
  latitude: string | number
  longitude: string | number
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  resolved_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapIncident(data: IncidentApiResponse): Incident {
  return {
    id: data.id,
    trip: data.trip,
    tripInfo: data.trip_info ?? '',
    incidentType: data.incident_type,
    incidentTypeName: data.incident_type_name ?? '',
    vehicle: data.vehicle,
    driver: data.driver,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    description: data.description,
    severity: data.severity,
    status: data.status,
    resolvedAt: data.resolved_at,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosIncidentRepository implements IncidentRepository {
  async list(params: IncidentListParams): Promise<PaginatedResult<Incident>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<IncidentApiResponse>>(
        '/incidents/incidents/',
        {
          params: {
            page: params.page,
            search: params.search || undefined,
            severity: params.severity || undefined,
            status: params.status || undefined,
          },
        },
      )
      return { ...data, results: data.results.map(mapIncident) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: IncidentPayload): Promise<Incident> {
    try {
      const { data } = await axiosClient.post<IncidentApiResponse>('/incidents/incidents/', payload)
      return mapIncident(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: IncidentPayload): Promise<Incident> {
    try {
      const { data } = await axiosClient.patch<IncidentApiResponse>(
        `/incidents/incidents/${id}/`,
        payload,
      )
      return mapIncident(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async resolve(id: number): Promise<Incident> {
    try {
      const { data } = await axiosClient.patch<IncidentApiResponse>(
        `/incidents/incidents/${id}/resolve/`,
      )
      return mapIncident(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/incidents/incidents/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
