// src/application/dtos/TripDto.ts
import type { TripStatus } from '../../domain/entities/Trip'

export interface TripFormDto {
  route: number
  vehicle: number
  driver: number
  schedule: number | null
  tripDate: string
  departureDatetime: string
  arrivalDatetime: string | null
  status: TripStatus
  passengerCount: number | null
  observations: string
}
