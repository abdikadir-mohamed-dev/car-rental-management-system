import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsersPage from '../pages/admin/ManageUsersPage'
import ManageVehiclesPage from '../pages/admin/ManageVehiclesPage'
import ManageBookingsPage from '../pages/admin/ManageBookingsPage'
import ManagePaymentsPage from '../pages/admin/ManagePaymentsPage'
import ReportsPage from '../pages/admin/ReportsPage'
import SettingsPage from '../pages/admin/SettingsPage'
import AdminProfilePage from '../pages/admin/AdminProfilePage'
import RentalPoliciesPage from '../pages/admin/RentalPoliciesPage'

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="vehicles" element={<ManageVehiclesPage />} />
        <Route path="bookings" element={<ManageBookingsPage />} />
        <Route path="policies" element={<RentalPoliciesPage />} />
        <Route path="payments" element={<ManagePaymentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
