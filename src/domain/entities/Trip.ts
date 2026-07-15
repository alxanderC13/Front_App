// src/domain/entities/Trip.ts

export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface Trip {
  id: number
  route: number
  routeCode: string
  vehicle: number
  vehiclePlate: string
  driver: number
  driverName: string
  schedule: number | null
  scheduleInfo: string | null
  tripDate: string
  departureDatetime: string
  arrivalDatetime: string | null
  status: TripStatus
  passengerCount: number | null
  observations: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
