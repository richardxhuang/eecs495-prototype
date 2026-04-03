import type { Zone } from '../types/domain'

export type ZoneStatus = 'no-budget' | 'empty' | 'warning' | 'healthy'

export type ZoneVisualStyle = {
  fillColor: string
  strokeColor: string
}

const ZONE_COLORS: Record<ZoneStatus, ZoneVisualStyle> = {
  'no-budget': { fillColor: '#9CA3AF', strokeColor: '#4B5563' },
  empty: { fillColor: '#EF4444', strokeColor: '#B91C1C' },
  warning: { fillColor: '#F59E0B', strokeColor: '#B45309' },
  healthy: { fillColor: '#22C55E', strokeColor: '#15803D' },
}

export const getZoneRemainingRatio = (zone: Zone): number | null => {
  const { totalHours, usedHours } = zone.budget
  if (totalHours === undefined) {
    return null
  }

  if (totalHours <= 0) {
    return 0
  }

  const ratio = (totalHours - usedHours) / totalHours
  return Math.max(0, Math.min(1, ratio))
}

export const getZoneStatus = (zone: Zone): ZoneStatus => {
  const remainingRatio = getZoneRemainingRatio(zone)
  if (remainingRatio === null) {
    return 'no-budget'
  }
  if (remainingRatio <= 0) {
    return 'empty'
  }
  if (remainingRatio <= 0.5) {
    return 'warning'
  }
  return 'healthy'
}

export const getZoneStyle = (zone: Zone): ZoneVisualStyle => {
  const status = getZoneStatus(zone)
  return ZONE_COLORS[status]
}
