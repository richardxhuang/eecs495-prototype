import type { Employee } from '../types/domain'

type EmployeeCardProps = {
  employee: Employee
  assignedHours: number
  onAdjustHours: (delta: number) => void
  onDragStart: (employeeId: string) => void
  onDragEnd: () => void
}

export function EmployeeCard({
  employee,
  assignedHours,
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
      {employee.profileImageUrl ? (
        <img
          className="employee-avatar"
          src={employee.profileImageUrl}
          alt={`${employee.fullName} profile`}
        />
      ) : (
        <div className="employee-avatar employee-avatar-fallback">{employee.initials}</div>
      )}
      <div className="employee-meta">
        <strong>{employee.fullName}</strong>
        <span>{employee.initials}</span>
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
