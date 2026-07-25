// src/infrastructure/http/parse-api-error.ts
import { AxiosError } from 'axios'
import { ApiException } from '../../domain/exceptions/ApiException'

/**
 * Normaliza los errores que devuelve el backend (Django REST Framework).
 * Puede venir como:
 *  - { "success": false, "message": "mensaje específico", "errors": { "campo": ["error"] } }  ← formato más común
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

    if (typeof data === 'object') {
      const wrapped = data as Record<string, unknown>

      // Formato del backend: { success: false, message: "...", errors: {...} }
      if (typeof wrapped.message === 'string' && wrapped.message.length > 0) {
        const errors =
          typeof wrapped.errors === 'object' && wrapped.errors !== null
            ? (wrapped.errors as Record<string, string[]>)
            : undefined
        return new ApiException(wrapped.message, status, errors)
      }

      // Formato DRF plano: { detail: "..." }
      if ('detail' in wrapped) {
        return new ApiException(String(wrapped.detail), status)
      }

      // Formato DRF de validación plano: { campo: ["error1", "error2"] }
      const fieldErrors = wrapped as Record<string, string[]>
      const firstKey = Object.keys(fieldErrors)[0]
      const firstMessage = firstKey ? fieldErrors[firstKey]?.[0] : undefined
      if (firstMessage) {
        return new ApiException(firstMessage, status, fieldErrors)
      }
    }

    return new ApiException('Ocurrió un error inesperado.', status)
  }

  return new ApiException('Ocurrió un error inesperado.', 0)
}
