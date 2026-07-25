// src/presentation/components/LiveTripMap.tsx
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Clock } from 'lucide-react'
import type { PublicRouteStop, RouteCoordinate } from '../../domain/entities/PublicRoute'
import type { GPSPosition } from '../../domain/entities/GPSPosition'
import { listGPSPositionsUseCase } from '../../infrastructure/factories/gps-position.factory'

const POLL_INTERVAL_MS = 5000
const ASSUMED_SPEED_KMH = 22 // respaldo si el GPS no reporta velocidad

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

function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const lat1 = toRad(a[0])
  const lat2 = toRad(b[0])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Encuentra el índice del punto más cercano de la ruta a la posición dada
function nearestSegmentIndex(path: [number, number][], point: [number, number]): number {
  let bestIndex = 0
  let bestDist = Infinity
  for (let i = 0; i < path.length; i++) {
    const d = haversineMeters(path[i], point)
    if (d < bestDist) {
      bestDist = d
      bestIndex = i
    }
  }
  return bestIndex
}

// Distancia restante desde el punto más cercano de la ruta hasta el final
function remainingDistanceMeters(path: [number, number][], point: [number, number]): number {
  if (path.length < 2) return 0
  const idx = nearestSegmentIndex(path, point)
  let distance = haversineMeters(point, path[idx])
  for (let j = idx; j < path.length - 1; j++) {
    distance += haversineMeters(path[j], path[j + 1])
  }
  return distance
}

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

  let etaMinutes: number | null = null
  if (currentPosition && routePolyline.length > 1) {
    const remainingMeters = remainingDistanceMeters(routePolyline, [
      currentPosition.latitude,
      currentPosition.longitude,
    ])
    const speedKmh =
      currentPosition.speed && currentPosition.speed > 1 ? currentPosition.speed : ASSUMED_SPEED_KMH
    etaMinutes = Math.max(0, Math.round((remainingMeters / 1000 / speedKmh) * 60))
  }

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

      {etaMinutes !== null && (
        <div className="flex items-center gap-2 rounded-md border bg-success/10 p-3 text-sm">
          <Clock className="h-4 w-4 shrink-0 text-success" />
          <span className="text-muted-foreground">
            Llegada estimada a destino en{' '}
            <span className="font-medium text-foreground">
              {etaMinutes === 0 ? 'menos de 1 min' : `~${etaMinutes} min`}
            </span>
            {currentPosition?.speed ? ` · ${currentPosition.speed} km/h actual` : ''}
          </span>
        </div>
      )}

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
                {etaMinutes !== null && (
                  <>
                    <br />
                    ETA: ~{etaMinutes} min
                  </>
                )}
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
