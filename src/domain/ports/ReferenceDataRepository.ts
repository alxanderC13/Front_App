// src/domain/ports/ReferenceDataRepository.ts

export interface ReferenceOption {
  id: number
  label: string
}

export interface ReferenceDataRepository {
  listRouteOptions(): Promise<ReferenceOption[]>
  listVehicleOptions(): Promise<ReferenceOption[]>
  listDriverOptions(): Promise<ReferenceOption[]>
  listTripOptions(): Promise<ReferenceOption[]>
}
