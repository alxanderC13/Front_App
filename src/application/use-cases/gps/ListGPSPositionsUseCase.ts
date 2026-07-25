// src/application/use-cases/gps/ListGPSPositionsUseCase.ts
import type { GPSPositionRepository } from '../../../domain/ports/GPSPositionRepository'
import type { GPSPosition } from '../../../domain/entities/GPSPosition'

export class ListGPSPositionsUseCase {
  constructor(private readonly repository: GPSPositionRepository) {}

  execute(tripId: number, afterISO?: string): Promise<GPSPosition[]> {
    return this.repository.listPositions(tripId, afterISO)
  }
}
