// src/infrastructure/factories/reference-data.factory.ts
import { AxiosReferenceDataRepository } from '../adapters/axios-reference-data.repository'

export const referenceDataRepository = new AxiosReferenceDataRepository()
