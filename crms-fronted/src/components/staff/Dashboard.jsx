import { useState, useEffect } from 'react'
import { CalendarCheck, Car, ClipboardList, Activity, ArrowRight } from 'lucide-react'
import { getStaffDashboard } from '../../services/staffService'
import { Link } from 'react-router-dom'
import { BOOKING_STATUS } from '../../utils/constants'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getStaffDashboard()
        setData(res)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const { stats, todaySchedule, vehicleStatus, recentBookings } = data || {}

  const today = new Date().toISOString().split('T')[0]
  const upcomingBookings = (recentBookings || []).filter(
    (b) => (b.pickupDate || b.pickup_date) >= today && (b.status === BOOKING_STATUS.PENDING || b.status === BOOKING_STATUS.CONFIRMED)
  )

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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Today's Pickups</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.todayPickups ?? '-'}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Today's Returns</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.todayReturns ?? '-'}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Pending Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.pendingTasks ?? '-'}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Active Rentals</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.activeRentals ?? '-'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Today's Schedule</h3>
            <Link to="/staff/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(todaySchedule || []).map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-900">{item.time}</td>
                      <td className="py-3 px-4 text-slate-600">{item.customer}</td>
                      <td className="py-3 px-4 text-slate-600">{item.vehicle}</td>
                      <td className="py-3 px-4 text-slate-600">{item.action}</td>
                      <td className="py-3 px-4"><span className={`badge ${item.status === 'in_progress' ? 'badge-info' : item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{item.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Vehicle Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Available</span>
              <span className="text-sm font-medium text-slate-900">{vehicleStatus?.available ?? '-'}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: `${((vehicleStatus?.available || 0) / 45) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Rented</span>
              <span className="text-sm font-medium text-slate-900">{vehicleStatus?.rented ?? '-'}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${((vehicleStatus?.rented || 0) / 45) * 100}%` }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Maintenance</span>
              <span className="text-sm font-medium text-slate-900">{vehicleStatus?.maintenance ?? '-'}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{ width: `${((vehicleStatus?.maintenance || 0) / 45) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Upcoming Bookings</h3>
          <Link to="/staff/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {(upcomingBookings || []).map((booking) => (
                  <tr key={booking._id || booking.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-900">#{booking._id?.slice(-8) || booking.id}</td>
                    <td className="py-3 px-4 text-slate-600">{booking.user?.name || booking.customer?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{booking.vehicle?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{booking.pickupDate || booking.pickup_date} - {booking.dropoffDate || booking.dropoff_date}</td>
                    <td className="py-3 px-4"><span className={`badge capitalize ${booking.status === 'confirmed' ? 'badge-success' : booking.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>{booking.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {upcomingBookings.length === 0 && (
              <p className="text-center text-slate-500 py-8">No upcoming bookings.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
