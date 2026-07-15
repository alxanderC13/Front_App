// src/infrastructure/adapters/axios-trip.repository.ts
import type { TripRepository, TripListParams, TripPayload } from '../../domain/ports/TripRepository'
import type { Trip, TripStatus } from '../../domain/entities/Trip'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface TripApiResponse {
  id: number
  route: number
  route_code: string
  vehicle: number
  vehicle_plate: string
  driver: number
  driver_name: string
  schedule: number | null
  schedule_info: string | null
  trip_date: string
  departure_datetime: string
  arrival_datetime: string | null
  status: TripStatus
  passenger_count: number | null
  observations: string
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapTrip(data: TripApiResponse): Trip {
  return {
    id: data.id,
    route: data.route,
    routeCode: data.route_code,
    vehicle: data.vehicle,
    vehiclePlate: data.vehicle_plate,
    driver: data.driver,
    driverName: data.driver_name,
    schedule: data.schedule,
    scheduleInfo: data.schedule_info,
    tripDate: data.trip_date,
    departureDatetime: data.departure_datetime,
    arrivalDatetime: data.arrival_datetime,
    status: data.status,
    passengerCount: data.passenger_count,
    observations: data.observations,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosTripRepository implements TripRepository {
  async list(params: TripListParams): Promise<PaginatedResult<Trip>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<TripApiResponse>>('/operations/trips/', {
        params: { page: params.page, search: params.search || undefined, status: params.status || undefined },
      })
      return { ...data, results: data.results.map(mapTrip) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: TripPayload): Promise<Trip> {
    try {
      const { data } = await axiosClient.post<TripApiResponse>('/operations/trips/', payload)
      return mapTrip(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: TripPayload): Promise<Trip> {
    try {
      const { data } = await axiosClient.patch<TripApiResponse>(`/operations/trips/${id}/`, payload)
      return mapTrip(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/operations/trips/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
