import { Routes, Route } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import VehicleBrowsePage from '../pages/customer/VehicleBrowsePage'
import VehicleDetailsPage from '../pages/customer/VehicleDetailsPage'
import BookingPage from '../pages/customer/BookingPage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import MyPaymentsPage from '../pages/customer/MyPaymentsPage'
import ProfilePage from '../pages/customer/ProfilePage'
import SavedCarsPage from '../pages/customer/SavedCarsPage'
import NotificationsPage from '../pages/customer/NotificationsPage'
import SettingsPage from '../pages/customer/SettingsPage'
import HelpSupportPage from '../pages/customer/HelpSupportPage'

function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="browse" element={<VehicleBrowsePage />} />
        <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="booking/:vehicleId" element={<BookingPage />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />
        <Route path="saved-cars" element={<SavedCarsPage />} />
        <Route path="payments" element={<MyPaymentsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpSupportPage />} />
      </Route>
    </Routes>
  )
}

export default CustomerRoutes

