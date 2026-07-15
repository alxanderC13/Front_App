// src/infrastructure/factories/public.factory.ts
import { AxiosPublicTransportRepository } from '../adapters/axios-public-transport.repository'
import { ListPublicRoutesUseCase } from '../../application/use-cases/public/ListPublicRoutesUseCase'
import { GetRouteStopsUseCase } from '../../application/use-cases/public/GetRouteStopsUseCase'

const publicTransportRepository = new AxiosPublicTransportRepository()

export const listPublicRoutesUseCase = new ListPublicRoutesUseCase(publicTransportRepository)
export const getRouteStopsUseCase = new GetRouteStopsUseCase(publicTransportRepository)
