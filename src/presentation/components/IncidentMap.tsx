// src/presentation/components/IncidentMap.tsx
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Incident, IncidentSeverity } from '../../domain/entities/Incident'
import { Button } from './ui/button'
import { LocateFixed } from 'lucide-react'

const severityColors: Record<IncidentSeverity, string> = {
  low: 'hsl(216, 85%, 34%)', // primary (informativo)
  medium: 'hsl(38, 100%, 50%)', // warning
  high: 'hsl(0, 65%, 51%)', // destructive
}

const severityDelay: Record<IncidentSeverity, string> = {
  low: '~15 min',
  medium: '~30 min',
  high: '~60 min',
}

function severityIcon(severity: IncidentSeverity) {
  const color = severityColors[severity]
  return L.divIcon({
    className: 'incident-map-icon',
    html: `<div style="
      background: ${color};
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 2px solid white;
      box-shadow: 0 1px 6px rgba(0,0,0,0.4);
    ">!</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
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

function RecenterButton({ userPosition }: { userPosition: [number, number] | null }) {
  const map = useMap()
  if (!userPosition) return null
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control">
        <Button
          size="icon"
          variant="secondary"
          className="h-9 w-9 shadow-md"
          onClick={() => map.setView(userPosition, 15)}
          title="Centrar en mi ubicación"
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface IncidentMapProps {
  incidents: Incident[]
  onSelectIncident?: (incident: Incident) => void
  heightClassName?: string
}

export default function IncidentMap({
  incidents,
  onSelectIncident,
  heightClassName = 'h-96',
}: IncidentMapProps) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)

  const validIncidents = incidents.filter((i) => i.latitude !== 0 && i.longitude !== 0)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {
        // el usuario negó el permiso o no está disponible; no es un error crítico
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }, [])

  const center: [number, number] =
    validIncidents.length === 1
      ? [validIncidents[0].latitude, validIncidents[0].longitude]
      : validIncidents.length > 1
        ? [
            validIncidents.reduce((sum, i) => sum + i.latitude, 0) / validIncidents.length,
            validIncidents.reduce((sum, i) => sum + i.longitude, 0) / validIncidents.length,
          ]
        : userPosition ?? [-0.1807, -78.4678] // fallback: Quito

  return (
    <div className={`w-full overflow-hidden rounded-md border ${heightClassName}`}>
      <MapContainer center={center} zoom={validIncidents.length === 1 ? 15 : 12} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterButton userPosition={userPosition} />

        {userPosition && (
          <>
            <Circle center={userPosition} radius={200} pathOptions={{ color: '#2563eb', fillOpacity: 0.1 }} />
            <Marker position={userPosition} icon={userLocationIcon}>
              <Popup>Tú estás aquí</Popup>
            </Marker>
          </>
        )}

        {validIncidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={severityIcon(incident.severity)}
            eventHandlers={{
              click: () => onSelectIncident?.(incident),
            }}
          >
            <Popup>
              <strong>{incident.incidentTypeName}</strong>
              <br />
              Severidad: {incident.severity.toUpperCase()}
              <br />
              Demora estimada: {severityDelay[incident.severity]}
              <br />
              {incident.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {validIncidents.length === 0 && (
        <p className="p-4 text-center text-sm text-muted-foreground">
          No hay incidentes con ubicación registrada para mostrar en el mapa.
        </p>
      )}
    </div>
  )
}
