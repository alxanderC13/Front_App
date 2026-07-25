// src/infrastructure/factories/schedule.factory.ts
import { AxiosScheduleRepository } from '../adapters/axios-schedule.repository'
import { ListSchedulesByRouteUseCase } from '../../application/use-cases/ListSchedulesByRouteUseCase'

const scheduleRepository = new AxiosScheduleRepository()

export const listSchedulesByRouteUseCase = new ListSchedulesByRouteUseCase(scheduleRepository)
