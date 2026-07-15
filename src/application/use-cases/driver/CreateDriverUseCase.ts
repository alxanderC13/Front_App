// src/application/use-cases/driver/CreateDriverUseCase.ts
import type { DriverRepository } from '../../../domain/ports/DriverRepository'
import type { Driver } from '../../../domain/entities/Driver'
import type { DriverFormDto } from '../../dtos/DriverDto'

export class CreateDriverUseCase {
  constructor(private readonly repository: DriverRepository) {}

  execute(dto: DriverFormDto): Promise<Driver> {
    return this.repository.create({
      user: dto.user,
      license_number: dto.licenseNumber,
      license_type: dto.licenseType,
      hire_date: dto.hireDate,
      experience_years: dto.experienceYears,
      observations: dto.observations,
      is_available: dto.isAvailable,
    })
  }
}
