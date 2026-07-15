// src/infrastructure/factories/incident.factory.ts
import { AxiosIncidentRepository } from '../adapters/axios-incident.repository'
import { AxiosLookupRepository } from '../adapters/axios-lookup.repository'
import { ListIncidentsUseCase } from '../../application/use-cases/incident/ListIncidentsUseCase'
import { CreateIncidentUseCase } from '../../application/use-cases/incident/CreateIncidentUseCase'
import { UpdateIncidentUseCase } from '../../application/use-cases/incident/UpdateIncidentUseCase'
import { ResolveIncidentUseCase } from '../../application/use-cases/incident/ResolveIncidentUseCase'
import { DeleteIncidentUseCase } from '../../application/use-cases/incident/DeleteIncidentUseCase'
import { ListLookupUseCase } from '../../application/use-cases/ListLookupUseCase'

const incidentRepository = new AxiosIncidentRepository()

export const listIncidentsUseCase = new ListIncidentsUseCase(incidentRepository)
export const createIncidentUseCase = new CreateIncidentUseCase(incidentRepository)
export const updateIncidentUseCase = new UpdateIncidentUseCase(incidentRepository)
export const resolveIncidentUseCase = new ResolveIncidentUseCase(incidentRepository)
export const deleteIncidentUseCase = new DeleteIncidentUseCase(incidentRepository)

export const listIncidentTypesUseCase = new ListLookupUseCase(
  new AxiosLookupRepository('/incidents/incident-types/'),
)