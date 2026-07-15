// src/infrastructure/adapters/axios-vehicle.repository.ts
import type {
  VehicleRepository,
  VehicleListParams,
  VehiclePayload,
} from '../../domain/ports/VehicleRepository'
import type { Vehicle } from '../../domain/entities/Vehicle'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface VehicleApiResponse {
  id: number
  plate: string
  brand: string
  model: string
  year: number
  capacity: number
  transport_company: number | null
  transport_company_name: string | null
  vehicle_type: number | null
  vehicle_type_name: string | null
  vehicle_status: number | null
  vehicle_status_name: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

function mapVehicle(data: VehicleApiResponse): Vehicle {
  return {
    id: data.id,
    plate: data.plate,
    brand: data.brand,
    model: data.model,
    year: data.year,
    capacity: data.capacity,
    transportCompany: data.transport_company,
    transportCompanyName: data.transport_company_name,
    vehicleType: data.vehicle_type,
    vehicleTypeName: data.vehicle_type_name,
    vehicleStatus: data.vehicle_status,
    vehicleStatusName: data.vehicle_status_name,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export class AxiosVehicleRepository implements VehicleRepository {
  async list(params: VehicleListParams): Promise<PaginatedResult<Vehicle>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<VehicleApiResponse>>(
        '/transport/vehicles/',
        {
          params: {
            page: params.page,
            search: params.search || undefined,
            vehicle_type: params.vehicleType || undefined,
            vehicle_status: params.vehicleStatus || undefined,
            transport_company: params.transportCompany || undefined,
          },
        },
      )
      return { ...data, results: data.results.map(mapVehicle) }
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async getById(id: number): Promise<Vehicle> {
    try {
      const { data } = await axiosClient.get<VehicleApiResponse>(`/transport/vehicles/${id}/`)
      return mapVehicle(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async create(payload: VehiclePayload): Promise<Vehicle> {
    try {
      const { data } = await axiosClient.post<VehicleApiResponse>('/transport/vehicles/', payload)
      return mapVehicle(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async update(id: number, payload: VehiclePayload): Promise<Vehicle> {
    try {
      const { data } = await axiosClient.patch<VehicleApiResponse>(
        `/transport/vehicles/${id}/`,
        payload,
      )
      return mapVehicle(data)
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/transport/vehicles/${id}/`)
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
