import {
  GoogleMap,
  OverlayView,
  Polygon,
  Polyline,
  useJsApiLoader,
} from '@react-google-maps/api'
import { Fragment, useCallback, useMemo, useRef } from 'react'
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
  isCreateMode: boolean
  draftZonePath: Zone['path']
  onDraftZonePathChange: (path: Zone['path']) => void
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
  isCreateMode,
  draftZonePath,
  onDraftZonePathChange,
  draggedEmployeeId,
  hoveredZoneId,
  onZoneHover,
  onDropEmployee,
}: ZoneMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null)
  const projectionOverlayRef = useRef<google.maps.OverlayView | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey,
    libraries: loaderLibraries,
  })

  const employeeLookup = useMemo(
    () => Object.fromEntries(employees.map((employee) => [employee.id, employee])),
    [employees],
  )

  const zonePolygons = useMemo(() => {
    if (!isLoaded) {
      return []
    }

    return zones.map((zone) => ({
      zoneId: zone.id,
      polygon: new google.maps.Polygon({ paths: zone.path }),
    }))
  }, [isLoaded, zones])

  const getZoneIdAtClientPoint = useCallback(
    (clientX: number, clientY: number): string | undefined => {
      if (!mapRef.current || !projectionOverlayRef.current) {
        return undefined
      }

      const mapRect = mapRef.current.getDiv().getBoundingClientRect()
      const x = clientX - mapRect.left
      const y = clientY - mapRect.top

      if (x < 0 || y < 0 || x > mapRect.width || y > mapRect.height) {
        return undefined
      }

      const projection = projectionOverlayRef.current.getProjection()
      if (!projection) {
        return undefined
      }

      const point = new google.maps.Point(x, y)
      const latLng = projection.fromContainerPixelToLatLng(point)
      if (!latLng) {
        return undefined
      }

      const matchedZone = zonePolygons.find(({ polygon }) => {
        const inside = google.maps.geometry.poly.containsLocation(latLng, polygon)
        if (inside) {
          return true
        }

        return google.maps.geometry.poly.isLocationOnEdge(latLng, polygon, 0.00001)
      })

      return matchedZone?.zoneId
    },
    [zonePolygons],
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
      className={isCreateMode ? 'map-surface create-mode' : 'map-surface'}
      onDragOver={(event) => {
        event.preventDefault()
        if (isCreateMode) {
          return
        }
        if (!draggedEmployeeId) {
          onZoneHover(undefined)
          return
        }

        const zoneId = getZoneIdAtClientPoint(event.clientX, event.clientY)
        onZoneHover(zoneId)
      }}
      onDrop={(event) => {
        event.preventDefault()
        if (isCreateMode) {
          return
        }
        const employeeId = event.dataTransfer.getData('text/employee-id')
        const zoneId = getZoneIdAtClientPoint(event.clientX, event.clientY)
        if (!employeeId || !zoneId) {
          onZoneHover(undefined)
          return
        }
        onDropEmployee(employeeId, zoneId)
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
        onLoad={(map) => {
          mapRef.current = map

          const projectionOverlay = new google.maps.OverlayView()
          projectionOverlay.onAdd = () => {}
          projectionOverlay.draw = () => {}
          projectionOverlay.onRemove = () => {}
          projectionOverlay.setMap(map)
          projectionOverlayRef.current = projectionOverlay
        }}
        onUnmount={() => {
          projectionOverlayRef.current?.setMap(null)
          projectionOverlayRef.current = null
          mapRef.current = null
        }}
        onClick={(event) => {
          if (!isCreateMode || !event.latLng) {
            return
          }

          onDraftZonePathChange([
            ...draftZonePath,
            { lat: event.latLng.lat(), lng: event.latLng.lng() },
          ])
        }}
        onDrag={() => onZoneHover(undefined)}
      >
        {isCreateMode && draftZonePath.length >= 2 ? (
          <Polyline
            path={draftZonePath}
            options={{
              strokeColor: '#1d4ed8',
              strokeWeight: 3,
              zIndex: 60,
            }}
          />
        ) : null}

        {isCreateMode && draftZonePath.length >= 3 ? (
          <Polygon
            path={draftZonePath}
            options={{
              fillColor: '#2563eb',
              fillOpacity: 0.3,
              strokeColor: '#1d4ed8',
              strokeWeight: 2,
              zIndex: 50,
            }}
          />
        ) : null}

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
                position={{ lat: zone.center.lat - 0.0052, lng: zone.center.lng }}
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

                      return (
                        <span key={employeeId} className="zone-avatar-wrap">
                          <span className="zone-avatar zone-avatar-fallback">
                            {employee.initials}
                          </span>
                          <em className="zone-avatar-hours">{employeeHours[employeeId] ?? 0}h</em>
                          <small className="zone-avatar-initials">{employee.initials}</small>
                        </span>
                      )
                    })
                  )}
                </div>
              </OverlayView>

              {draggedEmployeeId ? (
                <OverlayView
                  key={`${zone.id}-hint`}
                  position={{ lat: zone.center.lat - 0.0083, lng: zone.center.lng }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div className={hoveredZoneId === zone.id ? 'zone-drag-hint active' : 'zone-drag-hint'}>
                    {hoveredZoneId === zone.id ? 'Release to assign' : 'Drop in zone'}
                  </div>
                </OverlayView>
              ) : null}
            </Fragment>
          )
        })}
      </GoogleMap>
    </div>
  )
}
