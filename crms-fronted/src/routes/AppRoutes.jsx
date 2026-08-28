import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import CustomerLayout from '../layouts/CustomerLayout'
import StaffLayout from '../layouts/StaffLayout'
import DriverLayout from '../layouts/DriverLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import { USER_ROLES } from '../utils/constants'

import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'
import VehicleListingPage from '../pages/public/VehicleListingPage'
import PublicVehicleDetailsPage from '../pages/public/VehicleDetailsPage'
import LocationsPage from '../pages/public/LocationsPage'
import DealsPage from '../pages/public/DealsPage'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsersPage from '../pages/admin/ManageUsersPage'
import ManageVehiclesPage from '../pages/admin/ManageVehiclesPage'
import ManageBookingsPage from '../pages/admin/ManageBookingsPage'
import ManagePaymentsPage from '../pages/admin/ManagePaymentsPage'
import ReportsPage from '../pages/admin/ReportsPage'
import AdminSettingsPage from '../pages/admin/SettingsPage'
import AdminProfilePage from '../pages/admin/AdminProfilePage'
import RentalPoliciesPage from '../pages/admin/RentalPoliciesPage'
import AdminNotificationsPage from '../pages/admin/AdminNotificationsPage'

import CustomerDashboard from '../pages/customer/CustomerDashboard'
import CustomerPoliciesPage from '../pages/customer/CustomerPoliciesPage'
import VehicleBrowsePage from '../pages/customer/VehicleBrowsePage'
import CustomerVehicleDetailsPage from '../pages/customer/VehicleDetailsPage'
import BookingPage from '../pages/customer/BookingPage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import MyPaymentsPage from '../pages/customer/MyPaymentsPage'
import ProfilePage from '../pages/customer/ProfilePage'
import SavedCarsPage from '../pages/customer/SavedCarsPage'
import NotificationsPage from '../pages/customer/NotificationsPage'
import SettingsPage from '../pages/customer/SettingsPage'
import HelpSupportPage from '../pages/customer/HelpSupportPage'
import UpcomingRentalsPage from '../pages/customer/UpcomingRentalsPage'
import ActiveRentalPage from '../pages/customer/ActiveRentalPage'
import BookingHistoryPage from '../pages/customer/BookingHistoryPage'
import RentalAgreementPage from '../pages/customer/RentalAgreementPage'
import ReviewsPage from '../pages/customer/ReviewsPage'
import PaymentsPage from '../pages/customer/PaymentsPage'

import StaffDashboard from '../pages/staff/StaffDashboard'
import StaffBookingsPage from '../pages/staff/StaffBookingsPage'
import StaffVehiclesPage from '../pages/staff/StaffVehiclesPage'
import StaffTripsPage from '../pages/staff/StaffTripsPage'
import StaffCalendarPage from '../pages/staff/StaffCalendarPage'
import StaffProfilePage from '../pages/staff/StaffProfilePage'
import StaffCheckinPage from '../pages/staff/StaffCheckinPage'
import StaffCheckoutPage from '../pages/staff/StaffCheckoutPage'
import StaffCustomersPage from '../pages/staff/StaffCustomersPage'
import StaffReportsPage from '../pages/staff/StaffReportsPage'
import StaffNotificationsPage from '../pages/staff/StaffNotificationsPage'
import StaffDriverAssignmentsPage from '../pages/staff/StaffDriverAssignmentsPage'

import DriverDashboard from '../pages/driver/DriverDashboard'
import DriverTripsPage from '../pages/driver/DriverTripsPage'
import DriverEarningsPage from '../pages/driver/DriverEarningsPage'
import DriverProfilePage from '../pages/driver/DriverProfilePage'
import DriverAssignmentsPage from '../pages/driver/DriverAssignmentsPage'
import DriverBookingsPage from '../pages/driver/DriverBookingspage'
import DriverVehiclesPage from '../pages/driver/DriverVehiclespage'
import DriverCustomersPage from '../pages/driver/DriverCustomers'
import DriverMaintenancePage from '../pages/driver/DriverMaintainancepage'
import DriverReportsPage from '../pages/driver/DriverReportpage'
import DriverNotificationsPage from '../pages/driver/DriverNotifications'
import DriverCheckinPage from '../pages/driver/DriverCheckinPage'
import DriverCheckoutPage from '../pages/driver/DriverCheckoutPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="vehicles" element={<VehicleListingPage />} />
        <Route path="vehicles/:id" element={<PublicVehicleDetailsPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="auth/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="vehicles" element={<ManageVehiclesPage />} />
        <Route path="bookings" element={<ManageBookingsPage />} />
        <Route path="policies" element={<RentalPoliciesPage />} />
        <Route path="payments" element={<ManagePaymentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="browse" element={<VehicleBrowsePage />} />
        <Route path="vehicles/:id" element={<CustomerVehicleDetailsPage />} />
        <Route path="booking/:vehicleId" element={<BookingPage />} />
        <Route path="my-bookings" element={<MyBookingsPage />} />
        <Route path="my-bookings/:id" element={<MyBookingsPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/upcoming" element={<UpcomingRentalsPage />} />
        <Route path="bookings/active" element={<ActiveRentalPage />} />
        <Route path="booking-history" element={<BookingHistoryPage />} />
        <Route path="agreements" element={<RentalAgreementPage />} />
        <Route path="agreements/:id" element={<RentalAgreementPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="saved-cars" element={<SavedCarsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="policies" element={<CustomerPoliciesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="help" element={<HelpSupportPage />} />
      </Route>

      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STAFF]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="bookings" element={<StaffBookingsPage />} />
        <Route path="checkout" element={<StaffCheckoutPage />} />
        <Route path="checkin" element={<StaffCheckinPage />} />
        <Route path="vehicles" element={<StaffVehiclesPage />} />
        <Route path="driver-assignments" element={<StaffDriverAssignmentsPage />} />
        <Route path="customers" element={<StaffCustomersPage />} />
        <Route path="reports" element={<StaffReportsPage />} />
        <Route path="notifications" element={<StaffNotificationsPage />} />
        <Route path="profile" element={<StaffProfilePage />} />
      </Route>

      <Route
        path="/driver/*"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.DRIVER]}>
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DriverDashboard />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="assignments" element={<DriverAssignmentsPage />} />
        <Route path="trips" element={<DriverTripsPage />} />
        <Route path="earnings" element={<DriverEarningsPage />} />
        <Route path="bookings" element={<DriverBookingsPage />} />
        <Route path="checkout" element={<DriverCheckoutPage />} />
        <Route path="checkin" element={<DriverCheckinPage />} />
        <Route path="vehicles" element={<DriverVehiclesPage />} />
        <Route path="customers" element={<DriverCustomersPage />} />
        <Route path="maintenance" element={<DriverMaintenancePage />} />
        <Route path="reports" element={<DriverReportsPage />} />
        <Route path="notifications" element={<DriverNotificationsPage />} />
        <Route path="profile" element={<DriverProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
