// src/application/use-cases/vehicle/ListVehiclesUseCase.ts
import type { VehicleRepository, VehicleListParams } from '../../../domain/ports/VehicleRepository'
import type { Vehicle } from '../../../domain/entities/Vehicle'
import type { PaginatedResult } from '../../../domain/entities/PaginatedResult'

export class ListVehiclesUseCase {
  constructor(private readonly repository: VehicleRepository) {}

  execute(params: VehicleListParams): Promise<PaginatedResult<Vehicle>> {
    return this.repository.list(params)
  }
}
