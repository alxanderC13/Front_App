// src/application/use-cases/vehicle/DeleteVehicleUseCase.ts
import type { VehicleRepository } from '../../../domain/ports/VehicleRepository'

export class DeleteVehicleUseCase {
  constructor(private readonly repository: VehicleRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}

