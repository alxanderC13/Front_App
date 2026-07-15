// src/infrastructure/adapters/axios-reference-data.repository.ts
import type { ReferenceDataRepository, ReferenceOption } from '../../domain/ports/ReferenceDataRepository'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

export class AxiosReferenceDataRepository implements ReferenceDataRepository {
  async listRouteOptions(): Promise<ReferenceOption[]> {
    try {
      const { data } = await axiosClient.get<{ results: { id: number; code: string; name: string }[] }>(
        '/transport/routes/',
        { params: { page_size: 100 } },
      )
      return data.results.map((r) => ({ id: r.id, label: `${r.code} — ${r.name}` }))
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async listVehicleOptions(): Promise<ReferenceOption[]> {
    try {
      const { data } = await axiosClient.get<{ results: { id: number; plate: string; brand: string }[] }>(
        '/transport/vehicles/',
        { params: { page_size: 100 } },
      )
      return data.results.map((v) => ({ id: v.id, label: `${v.plate} — ${v.brand}` }))
    } catch (error) {
      throw parseApiError(error)
    }
  }

  async listDriverOptions(): Promise<ReferenceOption[]> {
    try {
      const { data } = await axiosClient.get<{
        results: { id: number; user_full_name: string; user_username: string; license_number: string }[]
      }>('/operations/drivers/', { params: { page_size: 100 } })
      return data.results.map((d) => ({
        id: d.id,
        label: `${d.user_full_name || d.user_username} (${d.license_number})`,
      }))
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
