// src/infrastructure/adapters/axios-route.repository.ts
import type {
  RouteRepository,
  RouteListParams,
  RoutePayload,
} from '../../domain/ports/RouteRepository'
import type { RouteEntity } from '../../domain/entities/RouteEntity'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface RouteApiResponse {
  id: number
  code: string
  name: string
  description: string
  transport_company: number | null
  transport_company_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapRoute(data: RouteApiResponse): RouteEntity {
  return {
    id: data.id,
    code: data.code,
    name: data.name,
    description: data.description,
    transportCompany: data.transport_company,
    transportCompanyName: data.transport_company_name,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosRouteRepository implements RouteRepository {
  async list(params: RouteListParams): Promise<PaginatedResult<RouteEntity>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<RouteApiResponse>>(
        '/transport/routes/',
        {
          params: {
            page: params.page,
            search: params.search || undefined,
            transport_company: params.transportCompany || undefined,
          },
        },
      )
      return { ...data, results: data.results.map(mapRoute) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async getById(id: number): Promise<RouteEntity> {
    try {
      const { data } = await axiosClient.get<RouteApiResponse>(`/transport/routes/${id}/`)
      return mapRoute(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: RoutePayload): Promise<RouteEntity> {
    try {
      const { data } = await axiosClient.post<RouteApiResponse>('/transport/routes/', payload)
      return mapRoute(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: RoutePayload): Promise<RouteEntity> {
    try {
      const { data } = await axiosClient.patch<RouteApiResponse>(
        `/transport/routes/${id}/`,
        payload,
      )
      return mapRoute(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/transport/routes/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
