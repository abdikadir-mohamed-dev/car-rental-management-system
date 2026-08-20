import { Routes, Route } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import VehicleBrowsePage from '../pages/customer/VehicleBrowsePage'
import VehicleDetailsPage from '../pages/customer/VehicleDetailsPage'
import BookingPage from '../pages/customer/BookingPage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import MyPaymentsPage from '../pages/customer/MyPaymentsPage'
import ProfilePage from '../pages/customer/ProfilePage'

function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="vehicles" element={<VehicleBrowsePage />} />
        <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/new/:vehicleId" element={<BookingPage />} />
        <Route path="payments" element={<MyPaymentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default CustomerRoutes
