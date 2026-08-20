import { Routes, Route, Navigate } from 'react-router-dom'
import DriverRoutes from './DriverRoutes'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/driver/*" element={<DriverRoutes />} />
      <Route path="*" element={<Navigate to="/driver" replace />} />
    </Routes>
  )
}

export default AppRoutes
