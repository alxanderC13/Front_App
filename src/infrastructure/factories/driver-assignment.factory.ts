// src/infrastructure/factories/driver-assignment.factory.ts
import { AxiosDriverAssignmentRepository } from '../adapters/axios-driver-assignment.repository'
import { ListDriverAssignmentsUseCase } from '../../application/use-cases/driver-assignment/ListDriverAssignmentsUseCase'
import { CreateDriverAssignmentUseCase } from '../../application/use-cases/driver-assignment/CreateDriverAssignmentUseCase'
import { UpdateDriverAssignmentUseCase } from '../../application/use-cases/driver-assignment/UpdateDriverAssignmentUseCase'
import { DeleteDriverAssignmentUseCase } from '../../application/use-cases/driver-assignment/DeleteDriverAssignmentUseCase'

const driverAssignmentRepository = new AxiosDriverAssignmentRepository()

export const listDriverAssignmentsUseCase = new ListDriverAssignmentsUseCase(driverAssignmentRepository)
export const createDriverAssignmentUseCase = new CreateDriverAssignmentUseCase(driverAssignmentRepository)
export const updateDriverAssignmentUseCase = new UpdateDriverAssignmentUseCase(driverAssignmentRepository)
export const deleteDriverAssignmentUseCase = new DeleteDriverAssignmentUseCase(driverAssignmentRepository)
