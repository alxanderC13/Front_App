// src/application/dtos/BusStopDto.ts

export interface BusStopFormDto {
  code: string
  name: string
  latitude: number
  longitude: number
  sector: number | null
}
