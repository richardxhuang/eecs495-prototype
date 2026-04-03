import { useMemo, useState } from 'react'
import { ViewToggle } from './components/ViewToggle'
import { employees, zones } from './data/mockData'
import { moveEmployeeToZone } from './lib/zoneAssignment'
import { ListView } from './views/ListView'
import { MapView } from './views/MapView'
import type { AssignmentMap, AppView, EmployeeHoursMap } from './types/domain'

const createEmptyAssignments = (): AssignmentMap =>
  Object.fromEntries(zones.map((zone) => [zone.id, []]))

const createInitialEmployeeHours = (): EmployeeHoursMap =>
  Object.fromEntries(employees.map((employee) => [employee.id, 4]))

function App() {
  const [activeView, setActiveView] = useState<AppView>('map')
  const [assignments, setAssignments] = useState<AssignmentMap>(createEmptyAssignments)
  const [employeeHours, setEmployeeHours] = useState<EmployeeHoursMap>(
    createInitialEmployeeHours,
  )

  const zonesWithRuntimeHours = useMemo(
    () =>
      zones.map((zone) => {
        const assignedEmployeeIds = assignments[zone.id] ?? []
        const assignmentHours = assignedEmployeeIds.reduce(
          (sum, employeeId) => sum + (employeeHours[employeeId] ?? 0),
          0,
        )

        return {
          ...zone,
          budget: {
            ...zone.budget,
            usedHours: zone.budget.usedHours + assignmentHours,
          },
        }
      }),
    [assignments, employeeHours],
  )

  const assignmentSummary = useMemo(
    () =>
      zonesWithRuntimeHours.map((zone) => ({
        zoneId: zone.id,
        zoneName: zone.name,
        employeeCount: assignments[zone.id]?.length ?? 0,
      })),
    [assignments, zonesWithRuntimeHours],
  )

  const handleAssignEmployee = (employeeId: string, zoneId: string) => {
    setAssignments((current) => moveEmployeeToZone(current, employeeId, zoneId))
  }

  const handleChangeEmployeeHours = (employeeId: string, delta: number) => {
    setEmployeeHours((current) => {
      const previous = current[employeeId] ?? 0
      const nextHours = Math.min(12, Math.max(0, previous + delta))
      return {
        ...current,
        [employeeId]: nextHours,
      }
    })
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <h1>Employee Hours by Zone</h1>
          <p className="subtitle">Prototype map assignment workflow</p>
        </div>
        <ViewToggle activeView={activeView} onChange={setActiveView} />
      </header>

      {activeView === 'map' ? (
        <MapView
          employees={employees}
          zones={zonesWithRuntimeHours}
          assignments={assignments}
          employeeHours={employeeHours}
          onAssignEmployee={handleAssignEmployee}
          onChangeEmployeeHours={handleChangeEmployeeHours}
        />
      ) : (
        <ListView
          employees={employees}
          zones={zonesWithRuntimeHours}
          assignments={assignments}
          employeeHours={employeeHours}
          assignmentSummary={assignmentSummary}
        />
      )}
    </main>
  )
}

export default App
