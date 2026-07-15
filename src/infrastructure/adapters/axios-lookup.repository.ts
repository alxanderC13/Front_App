// src/infrastructure/adapters/axios-lookup.repository.ts
import type { LookupRepository } from '../../domain/ports/LookupRepository'
import type { Lookup } from '../../domain/entities/Lookup'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

export class AxiosLookupRepository implements LookupRepository {
  constructor(private readonly endpoint: string) {}

  async list(): Promise<PaginatedResult<Lookup>> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<Lookup>>(this.endpoint, {
        params: { page_size: 100 },
      })
      return data
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
