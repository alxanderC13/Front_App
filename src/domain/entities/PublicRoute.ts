// src/domain/entities/PublicRoute.ts

export interface PublicRoute {
  id: number
  code: string
  name: string
  description: string
}

export interface PublicRouteStop {
  id: number
  code: string
  name: string
  latitude: number
  longitude: number
  stopOrder: number
}

export interface PublicBusStop {
  id: number
  code: string
  name: string
  latitude: number
  longitude: number
}
