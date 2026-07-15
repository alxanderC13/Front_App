// src/application/use-cases/driver/DeleteDriverUseCase.ts
import type { DriverRepository } from '../../../domain/ports/DriverRepository'

export class DeleteDriverUseCase {
  constructor(private readonly repository: DriverRepository) {}

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
