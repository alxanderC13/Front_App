// src/infrastructure/adapters/axios-schedule.repository.ts
import type { ScheduleRepository } from '../../domain/ports/ScheduleRepository'
import type { Schedule } from '../../domain/entities/Schedule'
import type { PaginatedResult } from '../../domain/entities/PaginatedResult'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface ScheduleApiResponse {
  id: number
  route: number
  frequency_minutes: number | null
}

export class AxiosScheduleRepository implements ScheduleRepository {
  async listByRoute(routeId: number): Promise<Schedule[]> {
    try {
      const { data } = await axiosClient.get<PaginatedResult<ScheduleApiResponse>>('/operations/schedules/', {
        params: { route: routeId, page_size: 5 },
      })
      return data.results.map((s) => ({
        id: s.id,
        route: s.route,
        frequencyMinutes: s.frequency_minutes,
      }))
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
