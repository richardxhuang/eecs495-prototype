import type { AssignmentMap } from '../types/domain'

export const moveEmployeeToZone = (
  assignments: AssignmentMap,
  employeeId: string,
  targetZoneId: string,
): AssignmentMap => {
  const nextAssignments: AssignmentMap = {}

  for (const [zoneId, employeeIds] of Object.entries(assignments)) {
    const withoutEmployee = employeeIds.filter((id) => id !== employeeId)
    nextAssignments[zoneId] = withoutEmployee
  }

  const existingInTarget = nextAssignments[targetZoneId] ?? []
  nextAssignments[targetZoneId] = [...existingInTarget, employeeId]

  return nextAssignments
}
