// src/domain/entities/Vehicle.ts

export interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
  year: number
  capacity: number
  transportCompany: number | null
  transportCompanyName: string | null
  vehicleType: number | null
  vehicleTypeName: string | null
  vehicleStatus: number | null
  vehicleStatusName: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
