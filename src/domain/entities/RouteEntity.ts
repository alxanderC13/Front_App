// src/domain/entities/RouteEntity.ts

export interface RouteEntity {
  id: number
  code: string
  name: string
  description: string
  transportCompany: number | null
  transportCompanyName: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
