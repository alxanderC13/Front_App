// src/domain/entities/Driver.ts

export type LicenseType = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Driver {
  id: number
  user: number
  userFullName: string
  userUsername: string
  licenseNumber: string
  licenseType: LicenseType
  hireDate: string
  experienceYears: number
  observations: string
  isAvailable: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}
