// src/presentation/components/RouteMap.tsx
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { PublicRouteStop, RouteCoordinate } from '../../domain/entities/PublicRoute'

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

interface RouteMapProps {
  stops: PublicRouteStop[]
  coordinates: RouteCoordinate[]
  heightClassName?: string
}

export default function RouteMap({ stops, coordinates, heightClassName = 'h-96' }: RouteMapProps) {
  const sortedCoordinates = [...coordinates].sort((a, b) => a.order - b.order)
  const polylinePositions: [number, number][] = sortedCoordinates.map((c) => [
    c.latitude,
    c.longitude,
  ])

  const center: [number, number] =
    polylinePositions.length > 0
      ? polylinePositions[Math.floor(polylinePositions.length / 2)]
      : stops.length > 0
        ? [stops[0].latitude, stops[0].longitude]
        : [-0.1807, -78.4678] // fallback: Quito

  return (
    <div className={`w-full overflow-hidden rounded-md border ${heightClassName}`}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} pathOptions={{ color: 'hsl(216, 85%, 34%)', weight: 4 }} />
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
      </MapContainer>
    </div>
  )
}
