// src/infrastructure/adapters/axios-analytics.repository.ts
import type { AnalyticsRepository } from '../../domain/ports/AnalyticsRepository'
import type { DashboardStats } from '../../domain/entities/DashboardStats'
import { axiosClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'

interface DashboardApiResponse {
  total_trips_today: number
  active_vehicles: number
  total_incidents_open: number
  average_trip_duration_minutes: number
  punctuality_rate: number
}

export class AxiosAnalyticsRepository implements AnalyticsRepository {
  async getDashboard(): Promise<DashboardStats> {
    try {
      const { data } = await axiosClient.get<DashboardApiResponse>('/analytics/dashboard/')
      return {
        totalTripsToday: data.total_trips_today,
        activeVehicles: data.active_vehicles,
        totalIncidentsOpen: data.total_incidents_open,
        averageTripDurationMinutes: data.average_trip_duration_minutes,
        punctualityRate: data.punctuality_rate,
      }
    } catch (error) {
      throw parseApiError(error)
    }
  }
}
