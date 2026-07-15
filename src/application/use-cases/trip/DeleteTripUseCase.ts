// src/application/use-cases/trip/DeleteTripUseCase.ts
import type { TripRepository } from '../../../domain/ports/TripRepository'

export class DeleteTripUseCase {
  constructor(private readonly repository: TripRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
