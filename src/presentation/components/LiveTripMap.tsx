// src/presentation/components/LiveTripMap.tsx
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { PublicRouteStop, RouteCoordinate } from '../../domain/entities/PublicRoute'
import type { GPSPosition } from '../../domain/entities/GPSPosition'
import { listGPSPositionsUseCase } from '../../infrastructure/factories/gps-position.factory'

const POLL_INTERVAL_MS = 5000

function stopIcon(order: number) {
  return L.divIcon({
    className: 'route-map-stop-icon',
    html: `<div style="
      background: hsl(216 85% 34%);
      color: white;
      width: 22px;
      height: 22px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    ">${order}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

const vehicleIcon = L.divIcon({
  className: 'route-map-vehicle-icon',
  html: `<div style="
    background: hsl(123 46% 34%);
    color: white;
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  ">🚍</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
})

interface LiveTripMapProps {
  tripId: number
  stops: PublicRouteStop[]
  coordinates: RouteCoordinate[]
  heightClassName?: string
}

export default function LiveTripMap({
  tripId,
  stops,
  coordinates,
  heightClassName = 'h-96',
}: LiveTripMapProps) {
  const [positions, setPositions] = useState<GPSPosition[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const lastTimestampRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const newPositions = await listGPSPositionsUseCase.execute(tripId, lastTimestampRef.current)
        if (cancelled) return
        if (newPositions.length > 0) {
          setPositions((prev) => [...prev, ...newPositions])
          lastTimestampRef.current = newPositions[newPositions.length - 1].recordedAt
        }
        setIsConnected(true)
      } catch {
        if (!cancelled) setIsConnected(false)
      }
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [tripId])

  const sortedCoordinates = [...coordinates].sort((a, b) => a.order - b.order)
  const routePolyline: [number, number][] = sortedCoordinates.map((c) => [c.latitude, c.longitude])
  const trailPolyline: [number, number][] = positions.map((p) => [p.latitude, p.longitude])
  const currentPosition = positions[positions.length - 1]

  const center: [number, number] = currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : routePolyline.length > 0
      ? routePolyline[Math.floor(routePolyline.length / 2)]
      : [-0.1807, -78.4678]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`} />
        <span className="text-muted-foreground">
          {isConnected ? 'Conectado — actualizando cada 5s' : 'Sin conexión al servicio de GPS'}
        </span>
        {currentPosition && (
          <span className="ml-auto text-xs text-muted-foreground">
            Última actualización: {new Date(currentPosition.recordedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className={`w-full overflow-hidden rounded-md border ${heightClassName}`}>
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routePolyline.length > 1 && (
            <Polyline positions={routePolyline} pathOptions={{ color: 'hsl(216, 85%, 34%)', weight: 4 }} />
          )}

          {trailPolyline.length > 1 && (
            <Polyline
              positions={trailPolyline}
              pathOptions={{ color: 'hsl(123, 46%, 34%)', weight: 3, dashArray: '6 6' }}
            />
          )}

          {stops.map((stop) => (
            <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={stopIcon(stop.stopOrder)}>
              <Popup>
                <strong>{stop.name}</strong>
                <br />
                {stop.code}
              </Popup>
            </Marker>
          ))}

          {currentPosition && (
            <Marker position={[currentPosition.latitude, currentPosition.longitude]} icon={vehicleIcon}>
              <Popup>
                Vehículo en ruta
                <br />
                Velocidad: {currentPosition.speed ?? '—'} km/h
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {!currentPosition && (
        <p className="text-sm text-muted-foreground">
          Esperando posiciones GPS de este viaje. Si el backend está corriendo{' '}
          <code className="rounded bg-muted px-1">simulate_gps --trip_id={tripId}</code>, la posición
          aparecerá en unos segundos.
        </p>
      )}
    </div>
  )
}
