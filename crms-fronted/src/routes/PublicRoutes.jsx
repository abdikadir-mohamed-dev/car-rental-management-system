import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'

function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<div className="p-8 text-center text-slate-500">Public pages removed. Go to <a href="/customer" className="text-primary underline">Customer Dashboard</a>.</div>} />
      </Route>
    </Routes>
  )
}

export default PublicRoutes
