// src/presentation/components/RouteMap.tsx
import { useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { PublicRouteStop, RouteCoordinate } from '../../domain/entities/PublicRoute'
import { Button } from './ui/button'
import { LocateFixed, X } from 'lucide-react'

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

  const sortedCoordinates = [...coordinates].sort((a, b) => a.order - b.order)
  const polylinePositions: [number, number][] = sortedCoordinates.map((c) => [
    c.latitude,
    c.longitude,
  ])

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
    navigator.geolocation.getCurrentPosition((pos) => {
      const position: [number, number] = [pos.coords.latitude, pos.coords.longitude]
      setUserPosition(position)
      findNearestStopAndRoute(position)
    })
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="gap-2" onClick={handleUseMyLocation}>
          <LocateFixed className="h-4 w-4" />
          Usar mi ubicación
        </Button>
        {isLoadingRoute && (
          <span className="text-xs text-muted-foreground">Calculando ruta a pie...</span>
        )}
      </div>

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
