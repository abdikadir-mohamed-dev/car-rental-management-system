import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'
import VehicleListingPage from '../pages/public/VehicleListingPage'
import LocationsPage from '../pages/public/LocationsPage'
import DealsPage from '../pages/public/DealsPage'

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="vehicles" element={<VehicleListingPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="deals" element={<DealsPage />} />
      </Route>
    </Routes>
  )
}

export default PublicRoutes
