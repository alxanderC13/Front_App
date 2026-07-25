// src/presentation/components/RouteMap.tsx
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { PublicRouteStop, RouteCoordinate } from '../../domain/entities/PublicRoute'
import { Button } from './ui/button'
import { LocateFixed, X, Bus as BusIcon, Clock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'

function numberedIcon(order: number) {
  return L.divIcon({
    className: 'route-map-stop-icon',
    html: `<div style="
      background: hsl(216 85% 34%);
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    ">${order}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

const userLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `<div style="
    background: #2563eb;
    width: 18px;
    height: 18px;
    border-radius: 9999px;
    border: 3px solid white;
    box-shadow: 0 1px 6px rgba(0,0,0,0.5);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const busIcon = L.divIcon({
  className: 'route-map-bus-icon',
  html: `<div style="
    background: hsl(123 46% 34%);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  ">🚍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
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

function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}min`
}

// Interpola una posición a lo largo de una polilínea según el progreso t (0 a 1)
function interpolateAlongPath(path: [number, number][], t: number): [number, number] | null {
  if (path.length === 0) return null
  if (path.length === 1) return path[0]
  const totalSegments = path.length - 1
  const raw = t * totalSegments
  const i = Math.min(Math.floor(raw), totalSegments - 1)
  const frac = raw - i
  const a = path[i]
  const b = path[i + 1]
  return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]
}

// Distancia restante desde el progreso t hasta el final de la ruta
function remainingDistanceMeters(path: [number, number][], t: number): number {
  if (path.length < 2) return 0
  const current = interpolateAlongPath(path, t)
  if (!current) return 0
  const totalSegments = path.length - 1
  const raw = t * totalSegments
  const i = Math.min(Math.floor(raw), totalSegments - 1)
  let distance = haversineMeters(current, path[i + 1])
  for (let j = i + 1; j < totalSegments; j++) {
    distance += haversineMeters(path[j], path[j + 1])
  }
  return distance
}

// Encuentra el índice del punto de la polilínea más cercano a una parada
function nearestIndexToPoint(path: [number, number][], point: [number, number]): number {
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

// Distancia sobre el trazado de la ruta entre dos paradas
function distanceBetweenStops(
  path: [number, number][],
  stopA: PublicRouteStop,
  stopB: PublicRouteStop,
): number {
  if (path.length < 2) return haversineMeters([stopA.latitude, stopA.longitude], [stopB.latitude, stopB.longitude])
  const idxA = nearestIndexToPoint(path, [stopA.latitude, stopA.longitude])
  const idxB = nearestIndexToPoint(path, [stopB.latitude, stopB.longitude])
  const start = Math.min(idxA, idxB)
  const end = Math.max(idxA, idxB)
  let distance = 0
  for (let j = start; j < end; j++) {
    distance += haversineMeters(path[j], path[j + 1])
  }
  return distance
}

const BUS_CYCLE_SECONDS = 10
const ASSUMED_SPEED_KMH = 22 // velocidad urbana promedio estimada

interface RouteMapProps {
  stops: PublicRouteStop[]
  coordinates: RouteCoordinate[]
  heightClassName?: string
}

export default function RouteMap({ stops, coordinates, heightClassName = 'h-96' }: RouteMapProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [nearestStop, setNearestStop] = useState<PublicRouteStop | null>(null)
  const [walkingRoute, setWalkingRoute] = useState<[number, number][]>([])
  const [walkingDistance, setWalkingDistance] = useState<number | null>(null)
  const [walkingDuration, setWalkingDuration] = useState<number | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [busProgress, setBusProgress] = useState(0)

  const [originStopId, setOriginStopId] = useState<string>('')
  const [destinationStopId, setDestinationStopId] = useState<string>('')

  const sortedStops = [...stops].sort((a, b) => a.stopOrder - b.stopOrder)
  const sortedCoordinates = [...coordinates].sort((a, b) => a.order - b.order)
  const polylinePositions: [number, number][] = sortedCoordinates.map((c) => [
    c.latitude,
    c.longitude,
  ])

  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (polylinePositions.length < 2) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const cyclePos = (elapsed % (BUS_CYCLE_SECONDS * 2)) / BUS_CYCLE_SECONDS
      const t = cyclePos <= 1 ? cyclePos : 2 - cyclePos
      setBusProgress(t)
    }, 200)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polylinePositions.length])

  const busPosition = interpolateAlongPath(polylinePositions, busProgress)
  const remainingMeters = remainingDistanceMeters(polylinePositions, busProgress)
  const etaMinutes = Math.max(1, Math.round((remainingMeters / 1000 / ASSUMED_SPEED_KMH) * 60))

  const originStop = sortedStops.find((s) => String(s.id) === originStopId)
  const destinationStop = sortedStops.find((s) => String(s.id) === destinationStopId)

  let tripDistanceMeters: number | null = null
  let tripMinutes: number | null = null
  if (originStop && destinationStop && originStop.id !== destinationStop.id) {
    tripDistanceMeters = distanceBetweenStops(polylinePositions, originStop, destinationStop)
    tripMinutes = Math.max(1, Math.round((tripDistanceMeters / 1000 / ASSUMED_SPEED_KMH) * 60))
  }

  async function findNearestStopAndRoute(position: [number, number]) {
    if (stops.length === 0) return
    let nearest = stops[0]
    let minDist = Infinity
    for (const stop of stops) {
      const dist = haversineMeters(position, [stop.latitude, stop.longitude])
      if (dist < minDist) {
        minDist = dist
        nearest = stop
      }
    }
    setNearestStop(nearest)
    setIsLoadingRoute(true)
    try {
      const url = `https://router.project-osrm.org/route/v1/foot/${position[1]},${position[0]};${nearest.longitude},${nearest.latitude}?overview=full&geometries=geojson`
      const response = await fetch(url)
      const data = await response.json()
      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0]
        const coords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]],
        )
        setWalkingRoute(coords)
        setWalkingDistance(route.distance)
        setWalkingDuration(route.duration)
      }
    } catch {
      // si OSRM falla, no es crítico; simplemente no se muestra la ruta a pie
    } finally {
      setIsLoadingRoute(false)
    }
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserPosition(position)
        findNearestStopAndRoute(position)
      },
      (err) => {
        console.warn('[Geolocation] No se pudo obtener la ubicación', err)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  function handleClearWalkingRoute() {
    setNearestStop(null)
    setWalkingRoute([])
    setWalkingDistance(null)
    setWalkingDuration(null)
  }

  const center: [number, number] =
    polylinePositions.length > 0
      ? polylinePositions[Math.floor(polylinePositions.length / 2)]
      : stops.length > 0
        ? [stops[0].latitude, stops[0].longitude]
        : [-0.1807, -78.4678] // fallback: Quito

  return (
    <div className="flex flex-col gap-3">
      {sortedStops.length >= 2 && (
        <div className="rounded-md border bg-background p-4">
          <p className="mb-3 text-sm font-medium">¿Cuánto tarda el bus entre dos paradas?</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Origen</Label>
              <Select value={originStopId} onValueChange={setOriginStopId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona parada de origen" />
                </SelectTrigger>
                <SelectContent>
                  {sortedStops.map((stop) => (
                    <SelectItem key={stop.id} value={String(stop.id)}>
                      {stop.stopOrder}. {stop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Destino</Label>
              <Select value={destinationStopId} onValueChange={setDestinationStopId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona parada de destino" />
                </SelectTrigger>
                <SelectContent>
                  {sortedStops.map((stop) => (
                    <SelectItem key={stop.id} value={String(stop.id)}>
                      {stop.stopOrder}. {stop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {originStop && destinationStop && originStop.id === destinationStop.id && (
            <p className="mt-3 text-sm text-muted-foreground">
              Selecciona dos paradas diferentes para calcular el tiempo.
            </p>
          )}

          {tripDistanceMeters !== null && tripMinutes !== null && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              <span>
                De <span className="font-medium">{originStop?.name}</span> a{' '}
                <span className="font-medium">{destinationStop?.name}</span>:{' '}
                <span className="font-medium text-primary">~{tripMinutes} min</span> (
                {formatDistance(tripDistanceMeters)})
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleUseMyLocation}>
          <LocateFixed className="h-4 w-4" />
          Usar mi ubicación
        </Button>
        {isLoadingRoute && (
          <span className="text-xs text-muted-foreground">Calculando ruta a pie...</span>
        )}
      </div>

      {busPosition && polylinePositions.length > 1 && (
        <div className="flex items-center gap-2 rounded-md border bg-success/10 p-3 text-sm">
          <BusIcon className="h-4 w-4 shrink-0 text-success" />
          <span className="text-muted-foreground">
            Bus en ruta · llegada estimada a destino en{' '}
            <span className="font-medium text-foreground">~{etaMinutes} min</span>
          </span>
        </div>
      )}

      {nearestStop && walkingDistance !== null && walkingDuration !== null && (
        <div className="flex items-center justify-between rounded-md border bg-background p-3">
          <div>
            <p className="text-sm font-medium">{nearestStop.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistance(walkingDistance)} · {formatDuration(walkingDuration)} caminando
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClearWalkingRoute}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className={`w-full overflow-hidden rounded-md border ${heightClassName}`}>
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {polylinePositions.length > 1 && (
            <Polyline positions={polylinePositions} pathOptions={{ color: 'hsl(216, 85%, 34%)', weight: 4 }} />
          )}

          {walkingRoute.length > 1 && (
            <Polyline
              positions={walkingRoute}
              pathOptions={{ color: 'hsl(0, 66%, 47%)', weight: 4, dashArray: '6 6' }}
            />
          )}

          {stops.map((stop) => (
            <Marker key={stop.id} position={[stop.latitude, stop.longitude]} icon={numberedIcon(stop.stopOrder)}>
              <Popup>
                <strong>{stop.name}</strong>
                <br />
                {stop.code}
              </Popup>
            </Marker>
          ))}

          {busPosition && polylinePositions.length > 1 && (
            <Marker position={busPosition} icon={busIcon}>
              <Popup>Bus en ruta (simulado) · ETA ~{etaMinutes} min</Popup>
            </Marker>
          )}

          {userPosition && (
            <>
              <Circle center={userPosition} radius={80} pathOptions={{ color: '#2563eb', fillOpacity: 0.1 }} />
              <Marker position={userPosition} icon={userLocationIcon}>
                <Popup>Tú estás aquí</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}
