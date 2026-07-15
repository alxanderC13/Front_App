// src/domain/entities/User.ts

export interface Profile {
  avatarUrl: string | null
  address: string | null
  emergencyContact: string | null
  emergencyPhone: string | null
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  isActive: boolean
  groups: string[]
  dateJoined: string
  profile: Profile | null
}
