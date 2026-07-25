// src/infrastructure/factories/push-token.factory.ts
import { AxiosPushTokenRepository } from '../adapters/axios-push-token.repository'
import { RegisterPushTokenUseCase } from '../../application/use-cases/RegisterPushTokenUseCase'

const pushTokenRepository = new AxiosPushTokenRepository()

export const registerPushTokenUseCase = new RegisterPushTokenUseCase(pushTokenRepository)
