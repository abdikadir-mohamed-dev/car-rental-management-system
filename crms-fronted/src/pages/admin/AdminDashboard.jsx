import AdminDashboard from '../../components/admin/Dashboard'

function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of your system</p>
      </div>
      <AdminDashboard />
    </div>
  )
}

export default AdminDashboardPage
