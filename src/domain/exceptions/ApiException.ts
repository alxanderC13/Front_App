// src/domain/exceptions/ApiException.ts

export class ApiException extends Error {
  public readonly statusCode: number
  public readonly fieldErrors?: Record<string, string[]>

  constructor(message: string, statusCode: number, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiException'
    this.statusCode = statusCode
    this.fieldErrors = fieldErrors
  }
}
