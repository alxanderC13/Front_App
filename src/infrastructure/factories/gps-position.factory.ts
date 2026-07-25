// src/infrastructure/factories/gps-position.factory.ts
import { AxiosGPSPositionRepository } from '../adapters/axios-gps-position.repository'
import { ListGPSPositionsUseCase } from '../../application/use-cases/gps/ListGPSPositionsUseCase'

const gpsPositionRepository = new AxiosGPSPositionRepository()

export const listGPSPositionsUseCase = new ListGPSPositionsUseCase(gpsPositionRepository)
