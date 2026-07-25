// src/application/use-cases/public/GetRouteCoordinatesUseCase.ts
import type { PublicTransportRepository } from '../../../domain/ports/PublicTransportRepository'
import type { RouteCoordinate } from '../../../domain/entities/PublicRoute'

export class GetRouteCoordinatesUseCase {
  constructor(private readonly repository: PublicTransportRepository) {}

  execute(routeId: number): Promise<RouteCoordinate[]> {
    return this.repository.getRouteCoordinates(routeId)
  }
}
