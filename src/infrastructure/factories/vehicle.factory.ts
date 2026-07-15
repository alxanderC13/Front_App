// src/infrastructure/factories/vehicle.factory.ts
import { AxiosVehicleRepository } from '../adapters/axios-vehicle.repository'
import { ListVehiclesUseCase } from '../../application/use-cases/vehicle/ListVehiclesUseCase'
import { GetVehicleUseCase } from '../../application/use-cases/vehicle/GetVehicleUseCase'
import { CreateVehicleUseCase } from '../../application/use-cases/vehicle/CreateVehicleUseCase'
import { UpdateVehicleUseCase } from '../../application/use-cases/vehicle/UpdateVehicleUseCase'
import { DeleteVehicleUseCase } from '../../application/use-cases/vehicle/DeleteVehicleUseCase'

const vehicleRepository = new AxiosVehicleRepository()

export const listVehiclesUseCase = new ListVehiclesUseCase(vehicleRepository)
export const getVehicleUseCase = new GetVehicleUseCase(vehicleRepository)
export const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository)
export const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository)
export const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository)
