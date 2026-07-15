// src/application/use-cases/public/GetRouteStopsUseCase.ts
import type { PublicTransportRepository } from '../../../domain/ports/PublicTransportRepository'
import type { PublicRouteStop } from '../../../domain/entities/PublicRoute'

export class GetRouteStopsUseCase {
  constructor(private readonly repository: PublicTransportRepository) {}

  execute(routeId: number): Promise<PublicRouteStop[]> {
    return this.repository.getRouteStops(routeId)
  }
}
