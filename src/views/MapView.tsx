import { useEffect, useState } from 'react'
import { EmployeeTray } from '../components/EmployeeTray'
import { ZoneMap } from '../components/ZoneMap'
import type {
  AssignmentMap,
  Employee,
  EmployeeHoursMap,
  LatLngPoint,
  NewZoneInput,
  Zone,
} from '../types/domain'

type MapViewProps = {
  employees: Employee[]
  zones: Zone[]
  assignments: AssignmentMap
  employeeHours: EmployeeHoursMap
  onAssignEmployee: (employeeId: string, zoneId: string) => void
  onChangeEmployeeHours: (employeeId: string, delta: number) => void
  onAddZone: (newZoneInput: NewZoneInput) => void
  startCreateZoneSignal: number
  zoneCount: number
}

export function MapView({
  employees,
  zones,
  assignments,
  employeeHours,
  onAssignEmployee,
  onChangeEmployeeHours,
  onAddZone,
  startCreateZoneSignal,
  zoneCount,
}: MapViewProps) {
  const [draggedEmployeeId, setDraggedEmployeeId] = useState<string>()
  const [hoveredZoneId, setHoveredZoneId] = useState<string>()
  const [isCreatingZone, setIsCreatingZone] = useState(false)
  const [newZoneName, setNewZoneName] = useState(`Zone ${zoneCount + 1}`)
  const [capacityMode, setCapacityMode] = useState<'finite' | 'infinite'>('finite')
  const [capacityHours, setCapacityHours] = useState(40)
  const [draftZonePath, setDraftZonePath] = useState<LatLngPoint[]>([])

  useEffect(() => {
    setNewZoneName(`Zone ${zoneCount + 1}`)
  }, [zoneCount])

  useEffect(() => {
    if (startCreateZoneSignal === 0) {
      return
    }
    setIsCreatingZone(true)
    setDraftZonePath([])
    setNewZoneName(`Zone ${zoneCount + 1}`)
  }, [startCreateZoneSignal, zoneCount])

  const canSaveZone =
    draftZonePath.length >= 3 && (capacityMode === 'infinite' || capacityHours > 0)

  return (
    <section className="map-layout">
      <EmployeeTray
        employees={employees}
        assignments={assignments}
        employeeHours={employeeHours}
        zoneOptions={zones}
        onAssignEmployeeToZone={onAssignEmployee}
        onChangeEmployeeHours={onChangeEmployeeHours}
        onDragStart={setDraggedEmployeeId}
        onDragEnd={() => {
          setDraggedEmployeeId(undefined)
          setHoveredZoneId(undefined)
        }}
      />

      <div className="map-panel">
        <div className="map-panel-header">
          <h2>Zones Map</h2>
          <button
            type="button"
            className="add-zone-map-btn"
            onClick={() => {
              setIsCreatingZone((current) => {
                const next = !current
                if (next) {
                  setDraftZonePath([])
                  setNewZoneName(`Zone ${zoneCount + 1}`)
                }
                return next
              })
            }}
          >
            {isCreatingZone ? 'Cancel' : '+ Add Zone'}
          </button>
        </div>
        {isCreatingZone ? (
          <section className="zone-creator-panel">
            <label>
              Zone name
              <input
                value={newZoneName}
                onChange={(event) => setNewZoneName(event.target.value)}
                placeholder={`Zone ${zoneCount + 1}`}
              />
            </label>
            <div className="zone-creator-row">
              <label>
                Capacity
                <select
                  value={capacityMode}
                  onChange={(event) => setCapacityMode(event.target.value as 'finite' | 'infinite')}
                >
                  <option value="finite">Finite hours</option>
                  <option value="infinite">No / Infinite capacity</option>
                </select>
              </label>
              {capacityMode === 'finite' ? (
                <label>
                  Hours
                  <input
                    type="number"
                    min={1}
                    value={capacityHours}
                    onChange={(event) => setCapacityHours(Number(event.target.value))}
                  />
                </label>
              ) : null}
            </div>
            <p className="helper-text">
              Click on the map to place polygon points. Add at least 3 points to define a zone.
            </p>
            <p className="helper-text">Points: {draftZonePath.length}</p>
            <div className="zone-creator-actions">
              <button
                type="button"
                className="add-zone-map-btn secondary"
                onClick={() => {
                  if (draftZonePath.length === 0) {
                    return
                  }
                  setDraftZonePath(draftZonePath.slice(0, -1))
                }}
              >
                Undo point
              </button>
              <button
                type="button"
                className="add-zone-map-btn secondary"
                onClick={() => setDraftZonePath([])}
              >
                Clear shape
              </button>
              <button
                type="button"
                className="add-zone-map-btn"
                disabled={!canSaveZone}
                onClick={() => {
                  if (!canSaveZone) {
                    return
                  }

                  onAddZone({
                    name: newZoneName,
                    path: draftZonePath,
                    totalHours: capacityMode === 'infinite' ? undefined : capacityHours,
                  })
                  setIsCreatingZone(false)
                  setDraftZonePath([])
                }}
              >
                Save zone
              </button>
            </div>
          </section>
        ) : null}
        <div className="map-canvas">
          <ZoneMap
            zones={zones}
            employees={employees}
            assignments={assignments}
            employeeHours={employeeHours}
            isCreateMode={isCreatingZone}
            draftZonePath={draftZonePath}
            onDraftZonePathChange={setDraftZonePath}
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
      </div>
    </section>
  )
}
