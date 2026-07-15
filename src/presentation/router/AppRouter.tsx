// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../pages/PlaceholderPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<PlaceholderPage title="Login" />} />

        {/* Público — catálogo de rutas y paradas */}
        <Route path="/" element={<PlaceholderPage title="Inicio — QuitoMove" />} />
        <Route path="/routes" element={<PlaceholderPage title="Rutas públicas" />} />
        <Route path="/routes/:id" element={<PlaceholderPage title="Detalle de ruta" />} />

        {/* Privado — requiere autenticación */}
        <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
        <Route path="/admin/vehicles" element={<PlaceholderPage title="Admin Vehículos" />} />
        <Route path="/admin/routes" element={<PlaceholderPage title="Admin Rutas" />} />
        <Route path="/admin/drivers" element={<PlaceholderPage title="Admin Conductores" />} />
        <Route path="/admin/assignments" element={<PlaceholderPage title="Admin Asignaciones" />} />
        <Route path="/admin/trips" element={<PlaceholderPage title="Admin Viajes" />} />
        <Route path="/admin/incidents" element={<PlaceholderPage title="Admin Incidentes" />} />
        <Route path="/admin/notifications" element={<PlaceholderPage title="Notificaciones" />} />
        <Route path="/admin/profile" element={<PlaceholderPage title="Mi Perfil" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
