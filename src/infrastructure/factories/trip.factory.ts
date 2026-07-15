// src/infrastructure/factories/trip.factory.ts
import { AxiosTripRepository } from '../adapters/axios-trip.repository'
import { ListTripsUseCase } from '../../application/use-cases/trip/ListTripsUseCase'
import { CreateTripUseCase } from '../../application/use-cases/trip/CreateTripUseCase'
import { UpdateTripUseCase } from '../../application/use-cases/trip/UpdateTripUseCase'
import { DeleteTripUseCase } from '../../application/use-cases/trip/DeleteTripUseCase'

const tripRepository = new AxiosTripRepository()

export const listTripsUseCase = new ListTripsUseCase(tripRepository)
export const createTripUseCase = new CreateTripUseCase(tripRepository)
export const updateTripUseCase = new UpdateTripUseCase(tripRepository)
export const deleteTripUseCase = new DeleteTripUseCase(tripRepository)
