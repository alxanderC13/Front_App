// src/domain/entities/DashboardStats.ts

export interface DashboardStats {
  totalTripsToday: number
  activeVehicles: number
  totalIncidentsOpen: number
  averageTripDurationMinutes: number
  punctualityRate: number
}
