// src/domain/ports/VehicleRepository.ts
import type { Vehicle } from '../entities/Vehicle'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface VehicleListParams {
  page?: number
  search?: string
  vehicleType?: number
  vehicleStatus?: number
  transportCompany?: number
}

export interface VehicleRepository {
  list(params: VehicleListParams): Promise<PaginatedResult<Vehicle>>
  getById(id: number): Promise<Vehicle>
  create(data: VehiclePayload): Promise<Vehicle>
  update(id: number, data: VehiclePayload): Promise<Vehicle>
  delete(id: number): Promise<void>
}

export interface VehiclePayload {
  plate: string
  brand: string
  model: string
  year: number
  capacity: number
  transport_company: number | null
  vehicle_type: number | null
  vehicle_status: number | null
}
