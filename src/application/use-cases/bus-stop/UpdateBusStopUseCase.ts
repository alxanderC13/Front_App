// src/application/use-cases/bus-stop/UpdateBusStopUseCase.ts
import type { BusStopRepository } from '../../../domain/ports/BusStopRepository'
import type { BusStop } from '../../../domain/entities/BusStop'
import type { BusStopFormDto } from '../../dtos/BusStopDto'

export class UpdateBusStopUseCase {
  constructor(private readonly repository: BusStopRepository) {}

  execute(id: number, dto: BusStopFormDto): Promise<BusStop> {
    return this.repository.update(id, dto)
  }
}
