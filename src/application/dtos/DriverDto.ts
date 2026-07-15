// src/application/dtos/DriverDto.ts
import type { LicenseType } from '../../domain/entities/Driver'

export interface DriverFormDto {
  user: number
  licenseNumber: string
  licenseType: LicenseType
  hireDate: string
  experienceYears: number
  observations: string
  isAvailable: boolean
}
