// src/application/use-cases/trip/ListTripsUseCase.ts
import type { TripRepository, TripListParams } from '../../../domain/ports/TripRepository'
import type { Trip } from '../../../domain/entities/Trip'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListTripsUseCase {
  constructor(private readonly repository: TripRepository) {}

  execute(params: TripListParams): Promise<PaginatedResult<Trip>> {
    return this.repository.list(params)
  }
}
