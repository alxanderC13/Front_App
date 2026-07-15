// src/domain/ports/AnalyticsRepository.ts
import type { DashboardStats } from '../entities/DashboardStats'

export interface AnalyticsRepository {
  getDashboard(): Promise<DashboardStats>
}
