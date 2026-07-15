// src/infrastructure/factories/profile.factory.ts
import { AxiosProfileRepository } from '../adapters/axios-profile.repository'
import { UpdateProfileUseCase } from '../../application/use-cases/profile/UpdateProfileUseCase'
import { ChangePasswordUseCase } from '../../application/use-cases/profile/ChangePasswordUseCase'

const profileRepository = new AxiosProfileRepository()

export const updateProfileUseCase = new UpdateProfileUseCase(profileRepository)
export const changePasswordUseCase = new ChangePasswordUseCase(profileRepository)
