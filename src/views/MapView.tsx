import { useState } from 'react'
import { EmployeeTray } from '../components/EmployeeTray'
import { ZoneMap } from '../components/ZoneMap'
import type { AssignmentMap, Employee, EmployeeHoursMap, Zone } from '../types/domain'

type MapViewProps = {
  employees: Employee[]
  zones: Zone[]
  assignments: AssignmentMap
  employeeHours: EmployeeHoursMap
  onAssignEmployee: (employeeId: string, zoneId: string) => void
  onChangeEmployeeHours: (employeeId: string, delta: number) => void
}

export function MapView({
  employees,
  zones,
  assignments,
  employeeHours,
  onAssignEmployee,
  onChangeEmployeeHours,
}: MapViewProps) {
  const [draggedEmployeeId, setDraggedEmployeeId] = useState<string>()
  const [hoveredZoneId, setHoveredZoneId] = useState<string>()

  return (
    <section className="map-layout">
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

      <div className="map-panel">
        <ZoneMap
          zones={zones}
          employees={employees}
          assignments={assignments}
          employeeHours={employeeHours}
          draggedEmployeeId={draggedEmployeeId}
          hoveredZoneId={hoveredZoneId}
          onZoneHover={setHoveredZoneId}
          onDropEmployee={(employeeId, zoneId) => {
            onAssignEmployee(employeeId, zoneId)
            setDraggedEmployeeId(undefined)
            setHoveredZoneId(undefined)
          }}
        />
      </div>
    </section>
  )
}
