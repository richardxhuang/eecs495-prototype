import {
  GoogleMap,
  OverlayView,
  Polygon,
  useJsApiLoader,
} from '@react-google-maps/api'
import { Fragment, useMemo } from 'react'
import {
  defaultMapCenter,
  defaultMapZoom,
  googleMapsApiKey,
  mapContainerStyle,
} from '../lib/googleMaps'
import { getZoneStatus, getZoneStyle } from '../lib/zoneStatus'
import type { AssignmentMap, Employee, EmployeeHoursMap, Zone } from '../types/domain'

type ZoneMapProps = {
  zones: Zone[]
  employees: Employee[]
  assignments: AssignmentMap
  employeeHours: EmployeeHoursMap
  draggedEmployeeId?: string
  hoveredZoneId?: string
  onZoneHover: (zoneId?: string) => void
  onDropEmployee: (employeeId: string, zoneId: string) => void
}

const loaderLibraries: ('geometry')[] = ['geometry']

export function ZoneMap({
  zones,
  employees,
  assignments,
  employeeHours,
  draggedEmployeeId,
  hoveredZoneId,
  onZoneHover,
  onDropEmployee,
}: ZoneMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
    libraries: loaderLibraries,
  })

  const employeeLookup = useMemo(
    () => Object.fromEntries(employees.map((employee) => [employee.id, employee])),
    [employees],
  )

  if (!googleMapsApiKey) {
    return (
      <div className="map-message">
        Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in your env file to render the map.
      </div>
    )
  }

  if (loadError) {
    return <div className="map-message">Google Maps failed to load.</div>
  }

  if (!isLoaded) {
    return <div className="map-message">Loading map...</div>
  }

  return (
    <div
      className="map-surface"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const employeeId = event.dataTransfer.getData('text/employee-id')
        if (!employeeId || !hoveredZoneId) {
          onZoneHover(undefined)
          return
        }
        onDropEmployee(employeeId, hoveredZoneId)
        onZoneHover(undefined)
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
        onDrag={() => onZoneHover(undefined)}
      >
        {zones.map((zone) => {
          const zoneStyle = getZoneStyle(zone)
          const isHovered = hoveredZoneId === zone.id
          const status = getZoneStatus(zone)
          const zoneEmployees = assignments[zone.id] ?? []
          const totalHours = zone.budget.totalHours
          const hoursLeft =
            totalHours === undefined ? null : Math.max(0, totalHours - zone.budget.usedHours)

          return (
            <Fragment key={zone.id}>
              <Polygon
                path={zone.path}
                options={{
                  fillColor: zoneStyle.fillColor,
                  fillOpacity: 0.38,
                  strokeColor: zoneStyle.strokeColor,
                  strokeOpacity: 0.95,
                  strokeWeight: isHovered ? 4 : 2,
                  zIndex: isHovered ? 10 : 1,
                }}
                onMouseOver={() => {
                  if (draggedEmployeeId) {
                    onZoneHover(zone.id)
                  }
                }}
                onMouseOut={() => {
                  if (draggedEmployeeId && hoveredZoneId === zone.id) {
                    onZoneHover(undefined)
                  }
                }}
              />
              <OverlayView
                key={`${zone.id}-label`}
                position={zone.center}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="zone-label">
                  <strong>{zone.name}</strong>
                  <span>
                    {status === 'no-budget'
                      ? 'No budget'
                      : `${hoursLeft}h left of ${totalHours}h`}
                  </span>
                </div>
              </OverlayView>

              <OverlayView
                key={`${zone.id}-employees`}
                position={{ lat: zone.center.lat + 0.0022, lng: zone.center.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="zone-assignees">
                  {zoneEmployees.length === 0 ? (
                    <span className="empty-assignment">No employees</span>
                  ) : (
                    zoneEmployees.map((employeeId) => {
                      const employee = employeeLookup[employeeId]
                      if (!employee) {
                        return null
                      }

                      return employee.profileImageUrl ? (
                        <span key={employeeId} className="zone-avatar-wrap">
                          <img
                            className="zone-avatar"
                            src={employee.profileImageUrl}
                            alt={`${employee.fullName} profile`}
                          />
                          <em className="zone-avatar-hours">{employeeHours[employeeId] ?? 0}h</em>
                        </span>
                      ) : (
                        <span key={employeeId} className="zone-avatar-wrap">
                          <span className="zone-avatar zone-avatar-fallback">
                            {employee.initials}
                          </span>
                          <em className="zone-avatar-hours">{employeeHours[employeeId] ?? 0}h</em>
                        </span>
                      )
                    })
                  )}
                </div>
              </OverlayView>

              <OverlayView
                key={`${zone.id}-drop-target`}
                position={{ lat: zone.center.lat - 0.0018, lng: zone.center.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  className={
                    hoveredZoneId === zone.id ? 'zone-drop-target active' : 'zone-drop-target'
                  }
                  onDragOver={(event) => {
                    event.preventDefault()
                    if (draggedEmployeeId) {
                      onZoneHover(zone.id)
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    const employeeId = event.dataTransfer.getData('text/employee-id')
                    if (!employeeId) {
                      return
                    }
                    onDropEmployee(employeeId, zone.id)
                    onZoneHover(undefined)
                  }}
                >
                  Drop here
                </div>
              </OverlayView>
            </Fragment>
          )
        })}
      </GoogleMap>
    </div>
  )
}
