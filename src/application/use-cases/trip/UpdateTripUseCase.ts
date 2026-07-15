// src/application/use-cases/trip/UpdateTripUseCase.ts
import type { TripRepository } from '../../../domain/ports/TripRepository'
import type { Trip } from '../../../domain/entities/Trip'
import type { TripFormDto } from '../../dtos/TripDto'

export class UpdateTripUseCase {
  constructor(private readonly repository: TripRepository) {}

  execute(id: number, dto: TripFormDto): Promise<Trip> {
    return this.repository.update(id, {
      route: dto.route,
      vehicle: dto.vehicle,
      driver: dto.driver,
      schedule: dto.schedule,
      trip_date: dto.tripDate,
      departure_datetime: dto.departureDatetime,
      arrival_datetime: dto.arrivalDatetime,
      status: dto.status,
      passenger_count: dto.passengerCount,
      observations: dto.observations,
    })
  }
}
