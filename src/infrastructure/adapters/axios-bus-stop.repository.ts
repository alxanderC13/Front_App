// src/infrastructure/adapters/axios-bus-stop.repository.ts
import type { BusStopRepository, BusStopListParams, BusStopPayload } from '../../domain/ports/BusStopRepository'
import type { BusStop } from '../../domain/entities/BusStop'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface BusStopApiResponse {
  id: number
  code: string
  name: string
  latitude: string | number
  longitude: string | number
  sector: number | null
  sector_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapBusStop(data: BusStopApiResponse): BusStop {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    sector: data.sector,
    sectorName: data.sector_name,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosBusStopRepository implements BusStopRepository {
  async list(params: BusStopListParams): Promise<PaginatedResult<BusStop>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<BusStopApiResponse>>('/transport/bus-stops/', {
        params: { page: params.page, search: params.search || undefined },
      })
      return { ...data, results: data.results.map(mapBusStop) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: BusStopPayload): Promise<BusStop> {
    try {
      const { data } = await axiosClient.post<BusStopApiResponse>('/transport/bus-stops/', payload)
      return mapBusStop(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: BusStopPayload): Promise<BusStop> {
    try {
      const { data } = await axiosClient.patch<BusStopApiResponse>(`/transport/bus-stops/${id}/`, payload)
      return mapBusStop(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/transport/bus-stops/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
