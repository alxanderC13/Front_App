// src/domain/entities/DriverAssignment.ts

export interface DriverAssignment {
  id: number
  driver: number
  driverName: string
  vehicle: number
  vehiclePlate: string
  assignmentDate: string
  endDate: string | null
  isActiveAssignment: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}
