// src/infrastructure/factories/auth.factory.ts
import { AxiosAuthRepository } from '../adapters/axios-auth.repository'
import { LoginUseCase } from '../../application/use-cases/LoginUseCase'
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase'
import { RequestPasswordResetUseCase } from '../../application/use-cases/RequestPasswordResetUseCase'
import { ConfirmPasswordResetUseCase } from '../../application/use-cases/ConfirmPasswordResetUseCase'
import { GetCurrentUserUseCase } from '../../application/use-cases/GetCurrentUserUseCase'
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCase'

const authRepository = new AxiosAuthRepository()

export const loginUseCase = new LoginUseCase(authRepository)
export const registerUseCase = new RegisterUseCase(authRepository)
export const requestPasswordResetUseCase = new RequestPasswordResetUseCase(authRepository)
export const confirmPasswordResetUseCase = new ConfirmPasswordResetUseCase(authRepository)
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository)
export const logoutUseCase = new LogoutUseCase(authRepository)
