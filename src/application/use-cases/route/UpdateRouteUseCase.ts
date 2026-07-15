// src/application/use-cases/route/UpdateRouteUseCase.ts
import type { RouteRepository } from '../../../domain/ports/RouteRepository'
import type { RouteEntity } from '../../../domain/entities/RouteEntity'
import type { RouteFormDto } from '../../dtos/RouteDto'

export class UpdateRouteUseCase {
  constructor(private readonly repository: RouteRepository) {}

  execute(id: number, dto: RouteFormDto): Promise<RouteEntity> {
    return this.repository.update(id, {
      code: dto.code,
      name: dto.name,
      description: dto.description,
      transport_company: dto.transportCompany,
    })
  }
}
