// src/application/use-cases/bus-stop/ListBusStopsUseCase.ts
import type { BusStopRepository, BusStopListParams } from '../../../domain/ports/BusStopRepository'
import type { BusStop } from '../../../domain/entities/BusStop'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListBusStopsUseCase {
  constructor(private readonly repository: BusStopRepository) {}

  execute(params: BusStopListParams): Promise<PaginatedResult<BusStop>> {
    return this.repository.list(params)
  }
}
