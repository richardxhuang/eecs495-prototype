export type AppView = 'map' | 'list'

export type LatLngPoint = {
  lat: number
  lng: number
}

export type Employee = {
  id: string
  fullName: string
  initials: string
  profileImageUrl?: string
}

export type ZoneBudget = {
  totalHours?: number
  usedHours: number
}

export type Zone = {
  id: string
  name: string
  path: LatLngPoint[]
  center: LatLngPoint
  budget: ZoneBudget
}

export type AssignmentMap = Record<string, string[]>

export type EmployeeHoursMap = Record<string, number>
