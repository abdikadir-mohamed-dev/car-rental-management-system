import { Routes, Route } from 'react-router-dom'
import DriverLayout from '../layouts/DriverLayout'
import DriverDashboard from '../pages/driver/DriverDashboard'
import DriverTripsPage from '../pages/driver/DriverTripsPage'
import DriverEarningsPage from '../pages/driver/DriverEarningsPage'
import DriverProfilePage from '../pages/driver/DriverProfilePage'

function DriverRoutes() {
  return (
    <Routes>
      <Route element={<DriverLayout />}>
        <Route index element={<DriverDashboard />} />
        <Route path="trips" element={<DriverTripsPage />} />
        <Route path="earnings" element={<DriverEarningsPage />} />
        <Route path="profile" element={<DriverProfilePage />} />
      </Route>
    </Routes>
  )
}

export default DriverRoutes
