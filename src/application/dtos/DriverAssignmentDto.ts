// src/application/dtos/DriverAssignmentDto.ts

export interface DriverAssignmentFormDto {
  driver: number
  vehicle: number
  assignmentDate: string
  endDate: string | null
  isActiveAssignment: boolean
}
