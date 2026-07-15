// src/infrastructure/factories/driver.factory.ts
import { AxiosDriverRepository } from '../adapters/axios-driver.repository'
import { ListDriversUseCase } from '../../application/use-cases/driver/ListDriversUseCase'
import { CreateDriverUseCase } from '../../application/use-cases/driver/CreateDriverUseCase'
import { UpdateDriverUseCase } from '../../application/use-cases/driver/UpdateDriverUseCase'
import { DeleteDriverUseCase } from '../../application/use-cases/driver/DeleteDriverUseCase'

const driverRepository = new AxiosDriverRepository()

export const listDriversUseCase = new ListDriversUseCase(driverRepository)
export const createDriverUseCase = new CreateDriverUseCase(driverRepository)
export const updateDriverUseCase = new UpdateDriverUseCase(driverRepository)
export const deleteDriverUseCase = new DeleteDriverUseCase(driverRepository)
