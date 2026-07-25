// src/domain/entities/Schedule.ts

export interface Schedule {
  id: number
  route: number
  frequencyMinutes: number | null
}
