// src/infrastructure/factories/bus-stop.factory.ts
import { AxiosBusStopRepository } from '../adapters/axios-bus-stop.repository'
import { AxiosLookupRepository } from '../adapters/axios-lookup.repository'
import { ListBusStopsUseCase } from '../../application/use-cases/bus-stop/ListBusStopsUseCase'
import { CreateBusStopUseCase } from '../../application/use-cases/bus-stop/CreateBusStopUseCase'
import { UpdateBusStopUseCase } from '../../application/use-cases/bus-stop/UpdateBusStopUseCase'
import { DeleteBusStopUseCase } from '../../application/use-cases/bus-stop/DeleteBusStopUseCase'
import { ListLookupUseCase } from '../../application/use-cases/ListLookupUseCase'

const busStopRepository = new AxiosBusStopRepository()

export const listBusStopsUseCase = new ListBusStopsUseCase(busStopRepository)
export const createBusStopUseCase = new CreateBusStopUseCase(busStopRepository)
export const updateBusStopUseCase = new UpdateBusStopUseCase(busStopRepository)
export const deleteBusStopUseCase = new DeleteBusStopUseCase(busStopRepository)

export const listSectorsUseCase = new ListLookupUseCase(new AxiosLookupRepository('/transport/sectors/'))
