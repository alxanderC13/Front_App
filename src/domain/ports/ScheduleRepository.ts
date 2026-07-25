// src/domain/ports/ScheduleRepository.ts
import type { Schedule } from '../entities/Schedule'

export interface ScheduleRepository {
  listByRoute(routeId: number): Promise<Schedule[]>
}
