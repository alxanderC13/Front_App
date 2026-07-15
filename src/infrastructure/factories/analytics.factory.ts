// src/infrastructure/factories/analytics.factory.ts
import { AxiosAnalyticsRepository } from '../adapters/axios-analytics.repository'
import { GetDashboardUseCase } from '../../application/use-cases/analytics/GetDashboardUseCase'

const analyticsRepository = new AxiosAnalyticsRepository()

export const getDashboardUseCase = new GetDashboardUseCase(analyticsRepository)
