import type { Employee, Zone } from '../types/domain'

export const employees: Employee[] = [
  {
    id: 'emp-avery',
    fullName: 'Avery Johnson',
    initials: 'AJ',
    profileImageUrl: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 'emp-riley',
    fullName: 'Riley Chen',
    initials: 'RC',
    profileImageUrl: 'https://i.pravatar.cc/80?img=22',
  },
  {
    id: 'emp-jordan',
    fullName: 'Jordan Patel',
    initials: 'JP',
    profileImageUrl: 'https://i.pravatar.cc/80?img=29',
  },
  {
    id: 'emp-taylor',
    fullName: 'Taylor Brown',
    initials: 'TB',
  },
  {
    id: 'emp-morgan',
    fullName: 'Morgan Lopez',
    initials: 'ML',
    profileImageUrl: 'https://i.pravatar.cc/80?img=41',
  },
]

export const zones: Zone[] = [
  {
    id: 'zone-north',
    name: 'North Zone',
    center: { lat: 41.8935, lng: -87.63 },
    path: [
      { lat: 41.8995, lng: -87.6425 },
      { lat: 41.8995, lng: -87.6175 },
      { lat: 41.8875, lng: -87.6175 },
      { lat: 41.8875, lng: -87.6425 },
    ],
    budget: {
      totalHours: undefined,
      usedHours: 0,
    },
  },
  {
    id: 'zone-central',
    name: 'Central Zone',
    center: { lat: 41.8787, lng: -87.63 },
    path: [
      { lat: 41.887, lng: -87.6425 },
      { lat: 41.887, lng: -87.6175 },
      { lat: 41.8705, lng: -87.6175 },
      { lat: 41.8705, lng: -87.6425 },
    ],
    budget: {
      totalHours: 40,
      usedHours: 40,
    },
  },
  {
    id: 'zone-south',
    name: 'South Zone',
    center: { lat: 41.8615, lng: -87.63 },
    path: [
      { lat: 41.8702, lng: -87.6425 },
      { lat: 41.8702, lng: -87.6175 },
      { lat: 41.8528, lng: -87.6175 },
      { lat: 41.8528, lng: -87.6425 },
    ],
    budget: {
      totalHours: 50,
      usedHours: 25,
    },
  },
  {
    id: 'zone-west',
    name: 'West Zone',
    center: { lat: 41.878, lng: -87.6535 },
    path: [
      { lat: 41.887, lng: -87.6645 },
      { lat: 41.887, lng: -87.6445 },
      { lat: 41.869, lng: -87.6445 },
      { lat: 41.869, lng: -87.6645 },
    ],
    budget: {
      totalHours: 45,
      usedHours: 0,
    },
  },
]
