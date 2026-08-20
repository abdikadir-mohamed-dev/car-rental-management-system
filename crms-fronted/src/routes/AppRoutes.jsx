import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import AuthRoutes from './AuthRoutes'
import CustomerRoutes from './CustomerRoutes'
import AdminRoutes from './AdminRoutes'
import StaffRoutes from './StaffRoutes'
import DriverRoutes from './DriverRoutes'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ErrorBoundary from '../components/common/ErrorBoundary'
import { USER_ROLES } from '../utils/constants'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthRoutes />} />
      <Route path="/customer/*" element={
        <ErrorBoundary>
          <CustomerRoutes />
        </ErrorBoundary>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
          <AdminRoutes />
        </ProtectedRoute>
      } />
      <Route path="/staff/*" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.STAFF]}>
          <StaffRoutes />
        </ProtectedRoute>
      } />
      <Route path="/driver/*" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.DRIVER]}>
          <DriverRoutes />
        </ProtectedRoute>
      } />
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
