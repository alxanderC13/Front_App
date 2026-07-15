// src/infrastructure/factories/lookup.factory.ts
import { AxiosLookupRepository } from '../adapters/axios-lookup.repository'
import { ListLookupUseCase } from '../../application/use-cases/ListLookupUseCase'

export const listVehicleTypesUseCase = new ListLookupUseCase(
  new AxiosLookupRepository('/transport/vehicle-types/'),
)
export const listVehicleStatusesUseCase = new ListLookupUseCase(
  new AxiosLookupRepository('/transport/vehicle-statuses/'),
)
export const listTransportCompaniesUseCase = new ListLookupUseCase(
  new AxiosLookupRepository('/transport/transport-companies/'),
)
