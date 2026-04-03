import { getZoneStatus } from '../lib/zoneStatus'
import type { AssignmentMap, Employee, EmployeeHoursMap, Zone } from '../types/domain'

type AssignmentSummaryItem = {
  zoneId: string
  zoneName: string
  employeeCount: number
}

type ListViewProps = {
  employees: Employee[]
  zones: Zone[]
  assignments: AssignmentMap
  employeeHours: EmployeeHoursMap
  assignmentSummary: AssignmentSummaryItem[]
}

export function ListView({
  employees,
  zones,
  assignments,
  employeeHours,
  assignmentSummary,
}: ListViewProps) {
  const employeeLookup = Object.fromEntries(employees.map((employee) => [employee.id, employee]))

  return (
    <section className="list-view">
      <h2>List View (Placeholder)</h2>
      <p className="helper-text">Map/List toggle is wired. This view will be expanded next.</p>
      <div className="zone-list">
        {assignmentSummary.map((summary) => {
          const zone = zones.find((item) => item.id === summary.zoneId)
          if (!zone) {
            return null
          }

          const status = getZoneStatus(zone)
          const assigned = assignments[zone.id] ?? []
          const totalHours = zone.budget.totalHours
          const usedHours = zone.budget.usedHours
          const hoursLeft = totalHours === undefined ? null : Math.max(0, totalHours - usedHours)

          return (
            <article key={zone.id} className="zone-row">
              <header>
                <strong>{summary.zoneName}</strong>
                <span>{summary.employeeCount} assigned</span>
              </header>
              <p>
                {status === 'no-budget'
                  ? 'No budget set'
                  : `${hoursLeft}h left of ${totalHours}h`}
              </p>
              <div className="list-assignees">
                {assigned.length > 0 ? (
                  assigned.map((employeeId) => (
                    <span key={employeeId} className="list-pill">
                      {(employeeLookup[employeeId]?.initials ?? employeeId) +
                        ` ${employeeHours[employeeId] ?? 0}h`}
                    </span>
                  ))
                ) : (
                  <span className="empty-assignment">No employees assigned</span>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
