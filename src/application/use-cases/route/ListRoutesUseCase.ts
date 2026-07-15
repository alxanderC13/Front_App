// src/application/use-cases/route/ListRoutesUseCase.ts
import type { RouteRepository, RouteListParams } from '../../../domain/ports/RouteRepository'
import type { RouteEntity } from '../../../domain/entities/RouteEntity'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListRoutesUseCase {
  constructor(private readonly repository: RouteRepository) {}

  execute(params: RouteListParams): Promise<PaginatedResult<RouteEntity>> {
    return this.repository.list(params)
  }
}
