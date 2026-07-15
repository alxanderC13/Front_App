// src/application/use-cases/analytics/GetDashboardUseCase.ts
import type { AnalyticsRepository } from '../../../domain/ports/AnalyticsRepository'
import type { DashboardStats } from '../../../domain/entities/DashboardStats'

export class GetDashboardUseCase {
  constructor(private readonly repository: AnalyticsRepository) {}

  execute(): Promise<DashboardStats> {
    return this.repository.getDashboard()
  }
}
