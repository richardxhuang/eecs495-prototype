import { useMemo, useState } from 'react'
import { ViewToggle } from './components/ViewToggle'
import { employees, zones as initialZones } from './data/mockData'
import { moveEmployeeToZone } from './lib/zoneAssignment'
import { ListView } from './views/ListView'
import { MapView } from './views/MapView'
import type {
  AssignmentMap,
  AppView,
  EmployeeHoursMap,
  NewZoneInput,
  Zone,
} from './types/domain'

const createEmptyAssignments = (zones: Zone[]): AssignmentMap =>
  Object.fromEntries(zones.map((zone) => [zone.id, []]))

const createInitialEmployeeHours = (): EmployeeHoursMap =>
  Object.fromEntries(employees.map((employee) => [employee.id, 4]))

function App() {
  const [activeView, setActiveView] = useState<AppView>('map')
  const [zones, setZones] = useState<Zone[]>(initialZones)
  const [startCreateZoneSignal, setStartCreateZoneSignal] = useState(0)
  const [assignments, setAssignments] = useState<AssignmentMap>(() =>
    createEmptyAssignments(initialZones),
  )
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
    [assignments, employeeHours, zones],
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

  const calculateCenterFromPath = (path: Zone['path']) => {
    const total = path.reduce(
      (acc, point) => ({
        lat: acc.lat + point.lat,
        lng: acc.lng + point.lng,
      }),
      { lat: 0, lng: 0 },
    )

    return {
      lat: total.lat / path.length,
      lng: total.lng / path.length,
    }
  }

  const handleAddZone = (newZoneInput: NewZoneInput) => {
    setZones((currentZones) => {
      const safeName = newZoneInput.name.trim() || `Zone ${currentZones.length + 1}`
      const zoneId = `zone-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      const newZone: Zone = {
        id: zoneId,
        name: safeName,
        center: calculateCenterFromPath(newZoneInput.path),
        path: newZoneInput.path,
        budget: {
          totalHours: newZoneInput.totalHours,
          usedHours: 0,
        },
      }

      setAssignments((currentAssignments) => ({
        ...currentAssignments,
        [newZone.id]: [],
      }))

      return [...currentZones, newZone]
    })
  }

  const handleStartCreateZone = () => {
    setActiveView('map')
    setStartCreateZoneSignal((current) => current + 1)
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
          onAddZone={handleAddZone}
          startCreateZoneSignal={startCreateZoneSignal}
          zoneCount={zones.length}
        />
      ) : (
        <ListView
          employees={employees}
          zones={zonesWithRuntimeHours}
          assignments={assignments}
          employeeHours={employeeHours}
          onAssignEmployee={handleAssignEmployee}
          onChangeEmployeeHours={handleChangeEmployeeHours}
          onStartCreateZone={handleStartCreateZone}
        />
      )}
    </main>
  )
}

export default App
