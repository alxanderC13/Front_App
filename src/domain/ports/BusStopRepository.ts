// src/domain/ports/BusStopRepository.ts
import type { BusStop } from '../entities/BusStop'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface BusStopListParams {
  page?: number
  search?: string
}

export interface BusStopPayload {
  code: string
  name: string
  latitude: number
  longitude: number
  sector: number | null
}

export interface BusStopRepository {
  list(params: BusStopListParams): Promise<PaginatedResult<BusStop>>
  create(data: BusStopPayload): Promise<BusStop>
  update(id: number, data: BusStopPayload): Promise<BusStop>
  delete(id: number): Promise<void>
}
