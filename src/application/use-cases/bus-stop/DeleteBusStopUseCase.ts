// src/application/use-cases/bus-stop/DeleteBusStopUseCase.ts
import type { BusStopRepository } from '../../../domain/ports/BusStopRepository'

export class DeleteBusStopUseCase {
  constructor(private readonly repository: BusStopRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
