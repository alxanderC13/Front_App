// src/application/use-cases/vehicle/GetVehicleUseCase.ts
import type { VehicleRepository } from '../../../domain/ports/VehicleRepository'
import type { Vehicle } from '../../../domain/entities/Vehicle'

export class GetVehicleUseCase {
  constructor(private readonly repository: VehicleRepository) {}

  execute(id: number): Promise<Vehicle> {
    return this.repository.getById(id)
  }
}
