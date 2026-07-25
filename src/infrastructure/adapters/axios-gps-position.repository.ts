// src/infrastructure/adapters/axios-gps-position.repository.ts
import type { GPSPositionRepository } from '../../domain/ports/GPSPositionRepository'
import type { GPSPosition } from '../../domain/entities/GPSPosition'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface GPSPositionApiResponse {
  id: number
  trip: number
  latitude: number | string
  longitude: number | string
  speed: number | string | null
  heading: number | string | null
  recorded_at: string
}

function mapPosition(data: GPSPositionApiResponse): GPSPosition {
  return {
    id: data.id,
    trip: data.trip,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    speed: data.speed !== null ? Number(data.speed) : null,
    heading: data.heading !== null ? Number(data.heading) : null,
    recordedAt: data.recorded_at,
  }
}

export class AxiosGPSPositionRepository implements GPSPositionRepository {
  async listPositions(tripId: number, afterISO?: string): Promise<GPSPosition[]> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<GPSPositionApiResponse> | GPSPositionApiResponse[]>(
        '/operations/gps-positions/',
        {
          params: {
            trip: tripId,
            recorded_at_after: afterISO || undefined,
            ordering: 'recorded_at',
            page_size: 100,
          },
        },
      )
      const results = Array.isArray(data) ? data : data.results
      return results.map(mapPosition)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
