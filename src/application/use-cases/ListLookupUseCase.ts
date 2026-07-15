// src/application/use-cases/ListLookupUseCase.ts
import type { LookupRepository } from '../../domain/ports/LookupRepository'
import type { Lookup } from '../../domain/entities/Lookup'

export class ListLookupUseCase {
  constructor(private readonly repository: LookupRepository) {}

  async execute(): Promise<Lookup[]> {
    const result = await this.repository.list()
    return result.results
  }
}
