// src/application/dtos/VehicleDto.ts

export interface VehicleFormDto {
  plate: string
  brand: string
  model: string
  year: number
  capacity: number
  transportCompany: number | null
  vehicleType: number | null
  vehicleStatus: number | null
}
