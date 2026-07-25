// src/application/use-cases/ListSchedulesByRouteUseCase.ts
import type { ScheduleRepository } from '../../domain/ports/ScheduleRepository'
import type { Schedule } from '../../domain/entities/Schedule'

export class ListSchedulesByRouteUseCase {
  constructor(private readonly repository: ScheduleRepository) {}

  execute(routeId: number): Promise<Schedule[]> {
    return this.repository.listByRoute(routeId)
  }
}
