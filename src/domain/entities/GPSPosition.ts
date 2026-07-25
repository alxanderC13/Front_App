// src/domain/entities/GPSPosition.ts

export interface GPSPosition {
  id: number
  trip: number
  latitude: number
  longitude: number
  speed: number | null
  heading: number | null
  recordedAt: string
}
