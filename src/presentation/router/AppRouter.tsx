// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PlaceholderPage from '../pages/PlaceholderPage'
import LoginPage from '../pages/auth/LoginPage'
import PrivateRoute from './PrivateRoute'
import AdminLayout from '../components/layout/AdminLayout'
import PublicLayout from '../components/layout/PublicLayout'
import HomePage from '../pages/home/HomePage'
import PublicRoutesPage from '../pages/catalog/PublicRoutesPage'
import PublicRouteDetailPage from '../pages/catalog/PublicRouteDetailPage'
import ContactPage from '../pages/contact/ContactPage'
import VehiclesListPage from '../pages/admin/vehicles/VehiclesListPage'
import RoutesListPage from '../pages/admin/routes/RoutesListPage'
import DashboardPage from '../pages/admin/dashboard/DashboardPage'
import DriversListPage from '../pages/admin/drivers/DriversListPage'
import TripsListPage from '../pages/admin/trips/TripsListPage'
import IncidentsListPage from '../pages/admin/incidents/IncidentsListPage'
import DriverAssignmentsListPage from '../pages/admin/assignments/DriverAssignmentsListPage'
import ProfilePage from '../pages/profile/ProfilePage'
import NotificationsPage from '../pages/notifications/NotificationsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Público — con navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<PublicRoutesPage />} />
          <Route path="/routes/:id" element={<PublicRouteDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Privado — cualquier usuario autenticado */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Privado — requiere rol Administrator */}
        <Route element={<PrivateRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/vehicles" element={<VehiclesListPage />} />
            <Route path="/admin/routes" element={<RoutesListPage />} />
            <Route path="/admin/drivers" element={<DriversListPage />} />
            <Route path="/admin/assignments" element={<DriverAssignmentsListPage />} />
            <Route path="/admin/trips" element={<TripsListPage />} />
            <Route path="/admin/incidents" element={<IncidentsListPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
