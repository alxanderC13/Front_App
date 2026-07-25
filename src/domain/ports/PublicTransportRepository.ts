// src/domain/ports/PublicTransportRepository.ts
import type { PublicRoute, PublicRouteStop, PublicBusStop, RouteCoordinate } from '../entities/PublicRoute'
import type { PaginatedResult } from '../entities/PaginatedResult'

export interface PublicTransportRepository {
  listRoutes(search?: string): Promise<PaginatedResult<PublicRoute>>
  getRouteStops(routeId: number): Promise<PublicRouteStop[]>
  getRouteCoordinates(routeId: number): Promise<RouteCoordinate[]>
  listBusStops(): Promise<PaginatedResult<PublicBusStop>>
}
