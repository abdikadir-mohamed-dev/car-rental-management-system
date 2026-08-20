import { Routes, Route, Navigate } from 'react-router-dom'

import DriverLayout from '../layouts/DriverLayout'
import DriverDashboard from '../pages/driver/DriverDashboard'
import DriverAssignmentsPage from '../pages/driver/DriverAssignmentsPage'
import DriverTripsPage from '../pages/driver/DriverTripsPage'
import DriverEarningsPage from '../pages/driver/DriverEarningsPage'
import DriverBookingsPage from '../pages/driver/DriverBookingspage'
import DriverVehiclesPage from '../pages/driver/DriverVehiclespage'
import DriverCustomersPage from '../pages/driver/DriverCustomers'
import DriverMaintenancePage from '../pages/driver/DriverMaintainancepage'
import DriverReportsPage from '../pages/driver/DriverReportpage'
import DriverNotificationsPage from '../pages/driver/DriverNotifications'
import DriverProfilePage from '../pages/driver/DriverProfilePage'

export default function DriverRoutes() {
  return (
    <Routes>
      <Route element={<DriverLayout />}>
        {/* /driver -> /driver/dashboard */}
        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="assignments" element={<DriverAssignmentsPage />} />
        <Route path="trips" element={<DriverTripsPage />} />
        <Route path="earnings" element={<DriverEarningsPage />} />
        <Route path="bookings" element={<DriverBookingsPage />} />
        <Route path="vehicles" element={<DriverVehiclesPage />} />
        <Route path="customers" element={<DriverCustomersPage />} />
        <Route path="maintenance" element={<DriverMaintenancePage />} />
        <Route path="reports" element={<DriverReportsPage />} />
        <Route path="notifications" element={<DriverNotificationsPage />} />
        <Route path="profile" element={<DriverProfilePage />} />

        {/* Unknown paths fall back to the driver dashboard */}
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  )
}