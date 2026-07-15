// src/infrastructure/http/parse-api-error.ts
import { AxiosError } from 'axios'
import { ApiException } from '../../domain/exceptions/ApiException'

/**
 * Normaliza los errores que devuelve Django REST Framework.
 * Puede venir como:
 *  - { "detail": "mensaje" }
 *  - { "campo": ["error 1", "error 2"] }
 *  - { "non_field_errors": ["error"] }
 */
export function parseApiError(error: unknown): ApiException {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const data = error.response?.data

    if (!data) {
      return new ApiException('No se pudo conectar con el servidor.', status)
    }

    if (typeof data === 'object' && 'detail' in data) {
      return new ApiException(String((data as Record<string, unknown>).detail), status)
    }

    if (typeof data === 'object') {
      const fieldErrors = data as Record<string, string[]>
      const firstKey = Object.keys(fieldErrors)[0]
      const firstMessage = firstKey ? fieldErrors[firstKey]?.[0] : undefined
      return new ApiException(
        firstMessage ?? 'Ocurrió un error de validación.',
        status,
        fieldErrors,
      )
    }

    return new ApiException('Ocurrió un error inesperado.', status)
  }

  return new ApiException('Ocurrió un error inesperado.', 0)
}
