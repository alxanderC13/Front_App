// src/infrastructure/factories/route.factory.ts
import { AxiosRouteRepository } from '../adapters/axios-route.repository'
import { ListRoutesUseCase } from '../../application/use-cases/route/ListRoutesUseCase'
import { CreateRouteUseCase } from '../../application/use-cases/route/CreateRouteUseCase'
import { UpdateRouteUseCase } from '../../application/use-cases/route/UpdateRouteUseCase'
import { DeleteRouteUseCase } from '../../application/use-cases/route/DeleteRouteUseCase'

const routeRepository = new AxiosRouteRepository()

export const listRoutesUseCase = new ListRoutesUseCase(routeRepository)
export const createRouteUseCase = new CreateRouteUseCase(routeRepository)
export const updateRouteUseCase = new UpdateRouteUseCase(routeRepository)
export const deleteRouteUseCase = new DeleteRouteUseCase(routeRepository)
