import { useMemo, useState } from 'react'
import { EmployeeTray } from '../components/EmployeeTray'
import { getZoneStatus } from '../lib/zoneStatus'
import type { AssignmentMap, Employee, EmployeeHoursMap, Zone } from '../types/domain'

type ListViewProps = {
  employees: Employee[]
  zones: Zone[]
  assignments: AssignmentMap
  employeeHours: EmployeeHoursMap
  onAssignEmployee: (employeeId: string, zoneId: string) => void
  onChangeEmployeeHours: (employeeId: string, delta: number) => void
  onStartCreateZone: () => void
}

export function ListView({
  employees,
  zones,
  assignments,
  employeeHours,
  onAssignEmployee,
  onChangeEmployeeHours,
  onStartCreateZone,
}: ListViewProps) {
  const [draggedEmployeeId, setDraggedEmployeeId] = useState<string>()
  const [hoveredZoneId, setHoveredZoneId] = useState<string>()

  const employeeLookup = Object.fromEntries(employees.map((employee) => [employee.id, employee]))
  const zoneCards = useMemo(
    () =>
      zones.map((zone) => {
        const totalHours = zone.budget.totalHours
        const hoursLeft =
          totalHours === undefined ? null : Math.max(0, totalHours - zone.budget.usedHours)

        return {
          zone,
          assignedIds: assignments[zone.id] ?? [],
          status: getZoneStatus(zone),
          totalHours,
          hoursLeft,
        }
      }),
    [assignments, zones],
  )

  return (
    <section className="list-layout">
      <EmployeeTray
        employees={employees}
        assignments={assignments}
        employeeHours={employeeHours}
        onChangeEmployeeHours={onChangeEmployeeHours}
        onDragStart={setDraggedEmployeeId}
        onDragEnd={() => {
          setDraggedEmployeeId(undefined)
          setHoveredZoneId(undefined)
        }}
      />

      <div className="list-board">
        <h2>YDDA Zones</h2>
        <p className="helper-text">YDDA Zones List</p>
        <div className="zone-list">
          {zoneCards.map(({ zone, assignedIds, status, totalHours, hoursLeft }) => (
            <article
              key={zone.id}
              className={`zone-card zone-card-${status} ${
                hoveredZoneId === zone.id ? 'zone-card-hovered' : ''
              }`}
            >
              <header className="zone-card-header">
                <strong>{zone.name}</strong>
                <span>{assignedIds.length} assigned</span>
              </header>
              <p className="zone-card-meta">
                {status === 'no-budget'
                  ? 'No budget set'
                  : `${hoursLeft}h left of ${totalHours}h`}
              </p>

              <div
                className="zone-drop-area"
                onDragOver={(event) => {
                  event.preventDefault()
                  if (draggedEmployeeId) {
                    setHoveredZoneId(zone.id)
                  }
                }}
                onDragLeave={() => {
                  if (hoveredZoneId === zone.id) {
                    setHoveredZoneId(undefined)
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  const employeeId = event.dataTransfer.getData('text/employee-id')
                  if (!employeeId) {
                    return
                  }
                  onAssignEmployee(employeeId, zone.id)
                  setDraggedEmployeeId(undefined)
                  setHoveredZoneId(undefined)
                }}
              >
                {assignedIds.length > 0 ? (
                  <div className="zone-drop-assignees">
                    {assignedIds.map((employeeId) => {
                      const employee = employeeLookup[employeeId]
                      if (!employee) {
                        return null
                      }

                      return (
                        <div key={employeeId} className="list-assignee-card">
                          {employee.profileImageUrl ? (
                            <img
                              className="list-assignee-avatar"
                              src={employee.profileImageUrl}
                              alt={`${employee.fullName} profile`}
                            />
                          ) : (
                            <span className="list-assignee-avatar list-assignee-fallback">
                              {employee.initials}
                            </span>
                          )}
                          <div className="list-assignee-meta">
                            <strong>{employee.initials}</strong>
                            <span>{employeeHours[employeeId] ?? 0}h</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <span className="zone-drop-empty">Drop employees here</span>
                )}
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="add-zone-btn"
          aria-label="Add new YDDA zone"
          onClick={onStartCreateZone}
        >
          + Add New YDDA Zone on Map
        </button>
      </div>
    </section>
  )
}
