// src/domain/ports/TripRepository.ts
import type { Trip, TripStatus } from '../entities/Trip'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface TripListParams {
  page?: number
  search?: string
  status?: TripStatus
}

export interface TripPayload {
  route: number
  vehicle: number
  driver: number
  schedule: number | null
  trip_date: string
  departure_datetime: string
  arrival_datetime: string | null
  status: TripStatus
  passenger_count: number | null
  observations: string
}

export interface TripRepository {
  list(params: TripListParams): Promise<PaginatedResult<Trip>>
  create(data: TripPayload): Promise<Trip>
  update(id: number, data: TripPayload): Promise<Trip>
  delete(id: number): Promise<void>
}
