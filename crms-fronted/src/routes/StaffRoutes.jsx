import { Routes, Route } from 'react-router-dom'
import StaffLayout from '../layouts/StaffLayout'
import StaffDashboard from '../pages/staff/StaffDashboard'
import StaffBookingsPage from '../pages/staff/StaffBookingsPage'
import StaffVehiclesPage from '../pages/staff/StaffVehiclesPage'
import StaffTripsPage from '../pages/staff/StaffTripsPage'
import StaffCalendarPage from '../pages/staff/StaffCalendarPage'
import StaffProfilePage from '../pages/staff/StaffProfilePage'
import StaffCheckoutPage from '../pages/staff/StaffCheckoutPage'
import StaffCheckinPage from '../pages/staff/StaffCheckinPage'

function StaffRoutes() {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="bookings" element={<StaffBookingsPage />} />
        <Route path="vehicles" element={<StaffVehiclesPage />} />
        <Route path="trips" element={<StaffTripsPage />} />
        <Route path="calendar" element={<StaffCalendarPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
        <Route path="checkout" element={<StaffCheckoutPage />} />
        <Route path="checkin" element={<StaffCheckinPage />} />
      </Route>
    </Routes>
  )
}

export default StaffRoutes
