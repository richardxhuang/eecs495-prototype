import type { Employee, Zone } from '../types/domain'

type EmployeeCardProps = {
  employee: Employee
  assignedHours: number
  zoneOptions?: Zone[]
  currentZoneId?: string
  onAssignEmployeeToZone?: (employeeId: string, zoneId: string) => void
  onAdjustHours: (delta: number) => void
  onDragStart: (employeeId: string) => void
  onDragEnd: () => void
}

export function EmployeeCard({
  employee,
  assignedHours,
  zoneOptions,
  currentZoneId,
  onAssignEmployeeToZone,
  onAdjustHours,
  onDragStart,
  onDragEnd,
}: EmployeeCardProps) {
  return (
    <article
      className="employee-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/employee-id', employee.id)
        event.dataTransfer.effectAllowed = 'move'
        onDragStart(employee.id)
      }}
      onDragEnd={onDragEnd}
    >
      <div className="employee-avatar employee-avatar-fallback">{employee.initials}</div>
      <div className="employee-meta">
        <strong>{employee.fullName}</strong>
        <span>{employee.initials}</span>
        {zoneOptions && onAssignEmployeeToZone ? (
          <select
            className="mobile-assignment-select"
            value={currentZoneId ?? ''}
            onChange={(event) => {
              const zoneId = event.target.value
              if (!zoneId) {
                return
              }
              onAssignEmployeeToZone(employee.id, zoneId)
            }}
          >
            <option value="">Assign to zone</option>
            {zoneOptions.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <div className="hours-stepper">
        <button
          type="button"
          aria-label={`Decrease ${employee.fullName} hours`}
          onClick={(event) => {
            event.stopPropagation()
            onAdjustHours(-1)
          }}
        >
          -
        </button>
        <span>{assignedHours}h</span>
        <button
          type="button"
          aria-label={`Increase ${employee.fullName} hours`}
          onClick={(event) => {
            event.stopPropagation()
            onAdjustHours(1)
          }}
        >
          +
        </button>
      </div>
    </article>
  )
}
