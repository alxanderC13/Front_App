// src/application/use-cases/route/DeleteRouteUseCase.ts
import type { RouteRepository } from '../../../domain/ports/RouteRepository'

export class DeleteRouteUseCase {
  constructor(private readonly repository: RouteRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
