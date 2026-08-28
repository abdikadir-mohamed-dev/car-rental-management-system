import { useState, useEffect } from 'react'
import { Users, Car, Calendar, DollarSign, TrendingUp, Clock, UserCheck } from 'lucide-react'
import { formatCurrencyKES } from '../../utils/formatCurrency'
import { BOOKING_STATUS } from '../../utils/constants'
import { getDashboardStats } from '../../services/adminService'

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    recentUsers: [],
    recentLogins: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getDashboardStats()
        const s = data.stats || data
        setStats({
          totalUsers: s.totalUsers || 0,
          totalVehicles: s.totalVehicles || 0,
          totalBookings: s.totalBookings || 0,
          totalRevenue: s.totalRevenue || 0,
          recentBookings: s.recentBookings || [],
          recentUsers: s.recentUsers || [],
          recentLogins: s.recentLogins || [],
        })
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 hover:underline">Retry</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Users</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalUsers || 0}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Vehicles</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalVehicles || 0}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalBookings || 0}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-info" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrencyKES(stats.totalRevenue || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {stats.recentBookings?.length > 0 ? (
              stats.recentBookings.map((booking) => (
                <div key={booking._id || booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{booking.vehicle?.name || booking.vehicle_name || 'Vehicle'}</p>
                    <p className="text-xs text-slate-500">{booking.user?.name || booking.customer_name || 'Customer'}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{formatCurrencyKES(booking.totalAmount || booking.total_amount || 0)}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent bookings</p>
            )}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Users
          </h3>
          <div className="space-y-3">
            {stats.recentUsers?.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user._id || user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent users</p>
            )}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" />
            Recent Logins
          </h3>
          <div className="space-y-3">
            {stats.recentLogins?.length > 0 ? (
              stats.recentLogins.map((login) => (
                <div key={login._id || login.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{login.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{login.role}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {login.lastLogin ? new Date(login.lastLogin).toLocaleString() : ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No recent logins</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
