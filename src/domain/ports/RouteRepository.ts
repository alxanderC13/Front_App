// src/domain/ports/RouteRepository.ts
import type { RouteEntity } from '../entities/RouteEntity'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface RouteListParams {
  page?: number
  search?: string
  transportCompany?: number
}

export interface RoutePayload {
  code: string
  name: string
  description: string
  transport_company: number | null
}

export interface RouteRepository {
  list(params: RouteListParams): Promise<PaginatedResult<RouteEntity>>
  getById(id: number): Promise<RouteEntity>
  create(data: RoutePayload): Promise<RouteEntity>
  update(id: number, data: RoutePayload): Promise<RouteEntity>
  delete(id: number): Promise<void>
}
