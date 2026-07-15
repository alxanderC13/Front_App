// src/domain/enums/Role.ts

export const Role = {
  ADMINISTRATOR: 'Administrator',
  USER: 'User',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export function isAdministrator(groups: string[]): boolean {
  return groups.includes(Role.ADMINISTRATOR)
}
