// src/domain/ports/LookupRepository.ts
import type { Lookup } from '../entities/Lookup'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface LookupRepository {
  list(): Promise<PaginatedResult<Lookup>>
}
