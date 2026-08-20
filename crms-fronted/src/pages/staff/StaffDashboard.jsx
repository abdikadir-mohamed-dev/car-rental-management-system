import Dashboard from '../../components/staff/Dashboard'

function StaffDashboard() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>
      <Dashboard />
    </div>
  )
}

export default StaffDashboard
