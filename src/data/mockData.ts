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
    name: 'Zone 1',
    center: { lat: 42.357, lng: -83.060 },
    path: [
      { lat: 42.3635, lng: -83.0735 },
      { lat: 42.3635, lng: -83.0465 },
      { lat: 42.3505, lng: -83.0465 },
      { lat: 42.3505, lng: -83.0735 },
    ],
    budget: {
      totalHours: undefined,
      usedHours: 0,
    },
  },
  {
    id: 'zone-central',
    name: 'Zone 2',
    center: { lat: 42.357, lng: -83.025 },
    path: [
      { lat: 42.3635, lng: -83.0385 },
      { lat: 42.3635, lng: -83.0115 },
      { lat: 42.3505, lng: -83.0115 },
      { lat: 42.3505, lng: -83.0385 },
    ],
    budget: {
      totalHours: 40,
      usedHours: 40,
    },
  },
  {
    id: 'zone-south',
    name: 'Zone 3',
    center: { lat: 42.332, lng: -83.060 },
    path: [
      { lat: 42.3385, lng: -83.0735 },
      { lat: 42.3385, lng: -83.0465 },
      { lat: 42.3255, lng: -83.0465 },
      { lat: 42.3255, lng: -83.0735 },
    ],
    budget: {
      totalHours: 50,
      usedHours: 25,
    },
  },
  {
    id: 'zone-west',
    name: 'Zone 4',
    center: { lat: 42.332, lng: -83.025 },
    path: [
      { lat: 42.3385, lng: -83.0385 },
      { lat: 42.3385, lng: -83.0115 },
      { lat: 42.3255, lng: -83.0115 },
      { lat: 42.3255, lng: -83.0385 },
    ],
    budget: {
      totalHours: 45,
      usedHours: 0,
    },
  },
]
