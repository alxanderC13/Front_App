// src/application/use-cases/vehicle/UpdateVehicleUseCase.ts
import type { VehicleRepository } from '../../../domain/ports/VehicleRepository'
import type { Vehicle } from '../../../domain/entities/Vehicle'
import type { VehicleFormDto } from '../../dtos/VehicleDto'

export class UpdateVehicleUseCase {
  constructor(private readonly repository: VehicleRepository) {}

  execute(id: number, dto: VehicleFormDto): Promise<Vehicle> {
    return this.repository.update(id, {
      plate: dto.plate,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      capacity: dto.capacity,
      transport_company: dto.transportCompany,
      vehicle_type: dto.vehicleType,
      vehicle_status: dto.vehicleStatus,
    })
  }
}
