// src/domain/ports/DriverRepository.ts
import type { Driver, LicenseType } from '../entities/Driver'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface DriverListParams {
  page?: number
  search?: string
}

export interface DriverPayload {
  user: number
  license_number: string
  license_type: LicenseType
  hire_date: string
  experience_years: number
  observations: string
  is_available: boolean
}

export interface DriverRepository {
  list(params: DriverListParams): Promise<PaginatedResult<Driver>>
  create(data: DriverPayload): Promise<Driver>
  update(id: number, data: DriverPayload): Promise<Driver>
  delete(id: number): Promise<void>
}
