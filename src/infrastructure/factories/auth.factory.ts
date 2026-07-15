// src/infrastructure/factories/auth.factory.ts
import { AxiosAuthRepository } from '../adapters/axios-auth.repository'
import { LoginUseCase } from '../../application/use-cases/LoginUseCase'
import { GetCurrentUserUseCase } from '../../application/use-cases/GetCurrentUserUseCase'
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCase'

const authRepository = new AxiosAuthRepository()

export const loginUseCase = new LoginUseCase(authRepository)
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository)
export const logoutUseCase = new LogoutUseCase(authRepository)
