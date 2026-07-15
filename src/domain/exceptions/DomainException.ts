// src/domain/exceptions/DomainException.ts

export class DomainException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainException'
  }
}
