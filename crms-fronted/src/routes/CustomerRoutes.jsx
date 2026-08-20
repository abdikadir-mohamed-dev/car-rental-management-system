import { Routes, Route } from 'react-router-dom'
import CustomerLayout from '../layouts/CustomerLayout'
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import VehicleBrowsePage from '../pages/customer/VehicleBrowsePage'
import VehicleDetailsPage from '../pages/customer/VehicleDetailsPage'
import BookingPage from '../pages/customer/BookingPage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import UpcomingRentalsPage from '../pages/customer/UpcomingRentalsPage'
import ActiveRentalPage from '../pages/customer/ActiveRentalPage'
import BookingHistoryPage from '../pages/customer/BookingHistoryPage'
import BookingDetailsPage from '../pages/customer/BookingDetailsPage'
import PaymentsPage from '../pages/customer/PaymentsPage'
import RentalAgreementPage from '../pages/customer/RentalAgreementPage'
import ProfilePage from '../pages/customer/ProfilePage'
import NotificationsPage from '../pages/customer/NotificationsPage'
import HelpSupportPage from '../pages/customer/HelpSupportPage'
import ReviewsPage from '../pages/customer/ReviewsPage'

function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="vehicles" element={<VehicleBrowsePage />} />
        <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/new/:vehicleId" element={<BookingPage />} />
        <Route path="bookings/upcoming" element={<UpcomingRentalsPage />} />
        <Route path="bookings/active" element={<ActiveRentalPage />} />
        <Route path="booking-history" element={<BookingHistoryPage />} />
        <Route path="bookings/:id" element={<BookingDetailsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="agreements" element={<RentalAgreementPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="support" element={<HelpSupportPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>
    </Routes>
  )
}

export default CustomerRoutes
