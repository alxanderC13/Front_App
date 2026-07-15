// src/infrastructure/adapters/axios-public-transport.repository.ts
import type { PublicTransportRepository } from '../../domain/ports/PublicTransportRepository'
import type { PublicRoute, PublicRouteStop, PublicBusStop } from '../../domain/entities/PublicRoute'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface RouteStopApiResponse {
  id: number
  code: string
  name: string
  latitude: string
  longitude: string
  stop_order: number
}

export class AxiosPublicTransportRepository implements PublicTransportRepository {
  async listRoutes(search?: string): Promise<PaginatedResult<PublicRoute>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<PublicRoute>>('/public/routes/', {
        params: { search: search || undefined, page_size: 50 },
      })
      return data
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async getRouteStops(routeId: number): Promise<PublicRouteStop[]> {
    try {
      const { data } = await axiosClient.get<RouteStopApiResponse[]>(
        `/public/routes/${routeId}/stops/`,
      )
      return data.map((stop) => ({
        id: stop.id,
        code: stop.code,
        name: stop.name,
        latitude: Number(stop.latitude),
        longitude: Number(stop.longitude),
        stopOrder: stop.stop_order,
      }))
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async listBusStops(): Promise<PaginatedResult<PublicBusStop>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<PublicBusStop>>('/public/bus-stops/', {
        params: { page_size: 100 },
      })
      return data
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
