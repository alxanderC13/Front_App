// src/domain/ports/GPSPositionRepository.ts
import type { GPSPosition } from '../entities/GPSPosition'

export interface GPSPositionRepository {
  listPositions(tripId: number, afterISO?: string): Promise<GPSPosition[]>
}
