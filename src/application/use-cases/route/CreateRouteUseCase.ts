// src/application/use-cases/route/CreateRouteUseCase.ts
import type { RouteRepository } from '../../../domain/ports/RouteRepository'
import type { RouteEntity } from '../../../domain/entities/RouteEntity'
import type { RouteFormDto } from '../../dtos/RouteDto'

export class CreateRouteUseCase {
  constructor(private readonly repository: RouteRepository) {}

  execute(dto: RouteFormDto): Promise<RouteEntity> {
    return this.repository.create({
      code: dto.code,
      name: dto.name,
      description: dto.description,
      transport_company: dto.transportCompany,
    })
  }
}
