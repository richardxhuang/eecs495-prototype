import { EmployeeCard } from './EmployeeCard'
import type { AssignmentMap, Employee, EmployeeHoursMap, Zone } from '../types/domain'

type EmployeeTrayProps = {
  employees: Employee[]
  assignments: AssignmentMap
  employeeHours: EmployeeHoursMap
  zoneOptions?: Zone[]
  onAssignEmployeeToZone?: (employeeId: string, zoneId: string) => void
  onChangeEmployeeHours: (employeeId: string, delta: number) => void
  onDragStart: (employeeId: string) => void
  onDragEnd: () => void
}

export function EmployeeTray({
  employees,
  assignments,
  employeeHours,
  zoneOptions,
  onAssignEmployeeToZone,
  onChangeEmployeeHours,
  onDragStart,
  onDragEnd,
}: EmployeeTrayProps) {
  const assignedIds = new Set(Object.values(assignments).flat())
  const employeeZoneLookup = Object.fromEntries(
    Object.entries(assignments).flatMap(([zoneId, employeeIds]) =>
      employeeIds.map((employeeId) => [employeeId, zoneId]),
    ),
  )
  const availableEmployees = employees.filter((employee) => !assignedIds.has(employee.id))
  const assignedEmployees = employees.filter((employee) => assignedIds.has(employee.id))

  return (
    <section className="employee-tray">
      <h2>Available Employees</h2>
      <p className="helper-text">
        Use +/- to set hours. Desktop: drag and drop. Mobile: use the assign dropdown.
      </p>
      <div className="employee-list">
        {availableEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            assignedHours={employeeHours[employee.id] ?? 0}
            zoneOptions={zoneOptions}
            currentZoneId={employeeZoneLookup[employee.id]}
            onAssignEmployeeToZone={onAssignEmployeeToZone}
            onAdjustHours={(delta) => onChangeEmployeeHours(employee.id, delta)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        {availableEmployees.length === 0 ? (
          <p className="helper-text">All employees are assigned to zones.</p>
        ) : null}
      </div>

      <h2 className="assigned-heading">Assigned Employees</h2>
      <div className="employee-list">
        {assignedEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            assignedHours={employeeHours[employee.id] ?? 0}
            zoneOptions={zoneOptions}
            currentZoneId={employeeZoneLookup[employee.id]}
            onAssignEmployeeToZone={onAssignEmployeeToZone}
            onAdjustHours={(delta) => onChangeEmployeeHours(employee.id, delta)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </section>
  )
}
