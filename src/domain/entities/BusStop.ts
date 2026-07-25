// src/domain/entities/BusStop.ts

export interface BusStop {
  id: number
  code: string
  name: string
  latitude: number
  longitude: number
  sector: number | null
  sectorName: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
