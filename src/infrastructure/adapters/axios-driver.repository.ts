// src/infrastructure/adapters/axios-driver.repository.ts
import type {
  DriverRepository,
  DriverListParams,
  DriverPayload,
} from '../../domain/ports/DriverRepository'
import type { Driver, LicenseType } from '../../domain/entities/Driver'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface DriverApiResponse {
  id: number
  user: number
  user_full_name: string
  user_username: string
  license_number: string
  license_type: LicenseType
  hire_date: string
  experience_years: number
  observations: string
  is_available: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapDriver(data: DriverApiResponse): Driver {
  return {
    id: data.id,
    user: data.user,
    userFullName: data.user_full_name,
    userUsername: data.user_username,
    licenseNumber: data.license_number,
    licenseType: data.license_type,
    hireDate: data.hire_date,
    experienceYears: data.experience_years,
    observations: data.observations,
    isAvailable: data.is_available,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosDriverRepository implements DriverRepository {
  async list(params: DriverListParams): Promise<PaginatedResult<Driver>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<DriverApiResponse>>(
        '/operations/drivers/',
        { params: { page: params.page, search: params.search || undefined } },
      )
      return { ...data, results: data.results.map(mapDriver) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: DriverPayload): Promise<Driver> {
    try {
      const { data } = await axiosClient.post<DriverApiResponse>('/operations/drivers/', payload)
      return mapDriver(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: DriverPayload): Promise<Driver> {
    try {
      const { data } = await axiosClient.patch<DriverApiResponse>(
        `/operations/drivers/${id}/`,
        payload,
      )
      return mapDriver(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/operations/drivers/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
