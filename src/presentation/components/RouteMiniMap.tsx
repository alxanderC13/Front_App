// src/presentation/components/RouteMiniMap.tsx
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { RouteCoordinate } from '../../domain/entities/PublicRoute'

interface RouteMiniMapProps {
  coordinates: RouteCoordinate[]
}

export default function RouteMiniMap({ coordinates }: RouteMiniMapProps) {
  const sorted = [...coordinates].sort((a, b) => a.order - b.order)
  const positions: [number, number][] = sorted.map((c) => [c.latitude, c.longitude])

  if (positions.length < 2) {
    return <div className="h-28 w-full rounded-md bg-muted" />
  }

  const center = positions[Math.floor(positions.length / 2)]

  return (
    <div className="pointer-events-none h-28 w-full overflow-hidden rounded-md border">
      <MapContainer
        center={center}
        zoom={12}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={positions} pathOptions={{ color: 'hsl(216, 85%, 34%)', weight: 3 }} />
      </MapContainer>
    </div>
  )
}
