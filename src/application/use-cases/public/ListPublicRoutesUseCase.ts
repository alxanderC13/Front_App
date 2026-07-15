// src/application/use-cases/public/ListPublicRoutesUseCase.ts
import type { PublicTransportRepository } from '../../../domain/ports/PublicTransportRepository'
import type { PublicRoute } from '../../../domain/entities/PublicRoute'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListPublicRoutesUseCase {
  constructor(private readonly repository: PublicTransportRepository) {}

  execute(search?: string): Promise<PaginatedResult<PublicRoute>> {
    return this.repository.listRoutes(search)
  }
}
