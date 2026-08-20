import { Routes, Route, Navigate } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import AuthRoutes from './AuthRoutes'
import CustomerRoutes from './CustomerRoutes'
import ErrorBoundary from '../components/common/ErrorBoundary'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/customer/*" element={
        <ErrorBoundary>
          <CustomerRoutes />
        </ErrorBoundary>
      } />
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
