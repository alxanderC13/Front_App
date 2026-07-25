// src/application/use-cases/bus-stop/CreateBusStopUseCase.ts
import type { BusStopRepository } from '../../../domain/ports/BusStopRepository'
import type { BusStop } from '../../../domain/entities/BusStop'
import type { BusStopFormDto } from '../../dtos/BusStopDto'

export class CreateBusStopUseCase {
  constructor(private readonly repository: BusStopRepository) {}

  execute(dto: BusStopFormDto): Promise<BusStop> {
    return this.repository.create(dto)
  }
}
