// src/application/use-cases/driver/ListDriversUseCase.ts
import type { DriverRepository, DriverListParams } from '../../../domain/ports/DriverRepository'
import type { Driver } from '../../../domain/entities/Driver'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListDriversUseCase {
  constructor(private readonly repository: DriverRepository) {}

  execute(params: DriverListParams): Promise<PaginatedResult<Driver>> {
    return this.repository.list(params)
  }
}
