// src/presentation/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import PrivateRoute from './PrivateRoute'
import AdminLayout from '../components/layout/AdminLayout'
import PublicLayout from '../components/layout/PublicLayout'
import HomePage from '../pages/home/HomePage'
import PublicRoutesPage from '../pages/catalog/PublicRoutesPage'
import PublicRouteDetailPage from '../pages/catalog/PublicRouteDetailPage'
import ContactPage from '../pages/contact/ContactPage'
import AboutPage from '../pages/about/AboutPage'
import VehiclesListPage from '../pages/admin/vehicles/VehiclesListPage'
import RoutesListPage from '../pages/admin/routes/RoutesListPage'
import DashboardPage from '../pages/admin/dashboard/DashboardPage'
import DriversListPage from '../pages/admin/drivers/DriversListPage'
import TripsListPage from '../pages/admin/trips/TripsListPage'
import LiveTripMapPage from '../pages/admin/trips/LiveTripMapPage'
import IncidentsListPage from '../pages/admin/incidents/IncidentsListPage'
import DriverAssignmentsListPage from '../pages/admin/assignments/DriverAssignmentsListPage'
import BusStopsListPage from '../pages/admin/stops/BusStopsListPage'
import ProfilePage from '../pages/profile/ProfilePage'
import NotificationsPage from '../pages/notifications/NotificationsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Público — con navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<PublicRoutesPage />} />
          <Route path="/routes/:id" element={<PublicRouteDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Privado — cualquier usuario autenticado (lectura; escritura solo Administrator via UI) */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/vehicles" element={<VehiclesListPage />} />
            <Route path="/admin/routes" element={<RoutesListPage />} />
            <Route path="/admin/drivers" element={<DriversListPage />} />
            <Route path="/admin/assignments" element={<DriverAssignmentsListPage />} />
            <Route path="/admin/trips" element={<TripsListPage />} />
            <Route path="/admin/trips/:id/live-map" element={<LiveTripMapPage />} />
            <Route path="/admin/incidents" element={<IncidentsListPage />} />
            <Route path="/admin/stops" element={<BusStopsListPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
