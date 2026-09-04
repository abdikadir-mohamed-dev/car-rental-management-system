import { useEffect, useState } from 'react'
import { MapPin, Clock } from 'lucide-react'
import {
  getDriverDashboard,
  getTrips
} from '../../services/driverService'

function Dashboard() {
  const [stats, setStats] = useState({
    trips_today: 0,
    upcoming: 0,
    completed: 0
  })

  const [todayTrips, setTodayTrips] = useState([])
  const [loading, setLoading] = useState(true)

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [dashboardData, tripsData] = await Promise.all([
        getDriverDashboard(),
        getTrips()
      ])

      setStats({
        trips_today: dashboardData?.trips_today || 0,
        upcoming: dashboardData?.upcoming || 0,
        completed: dashboardData?.completed || 0
      })

      // Get today's trips from the real backend
      const today = new Date().toISOString().split('T')[0]

      const todaysTrips = (tripsData || []).filter(
        (trip) => trip.date === today
      )

      setTodayTrips(todaysTrips)

    } catch (error) {
      console.error(
        'Failed to load driver dashboard:',
        error
      )

      setStats({
        trips_today: 0,
        upcoming: 0,
        completed: 0
      })

      setTodayTrips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const formatTime = (time) => {
    if (!time) return '--'

    const [hours, minutes] = time.split(':')

    const date = new Date()
    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    )

    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatStatus = (status) => {
    if (!status) return 'Unknown'

    if (status === 'active') {
      return 'Active'
    }

    if (status === 'upcoming') {
      return 'Upcoming'
    }

    if (status === 'completed') {
      return 'Completed'
    }

    if (status === 'cancelled') {
      return 'Cancelled'
    }

    return status
      .replace('_', ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  return (
    <div className="space-y-6">

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Today's Trips */}
        <div className="card p-6 flex items-center gap-4">

          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>

          <div>
            <p className="text-sm text-slate-600">
              Today's Trips
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.trips_today}
            </p>
          </div>

        </div>

        {/* Upcoming */}
        <div className="card p-6 flex items-center gap-4">

          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>

          <div>
            <p className="text-sm text-slate-600">
              Upcoming
            </p>

            <p className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.upcoming}
            </p>
          </div>

        </div>

      </div>

      {/* Today's Assignments */}
      <div className="card p-6">

        <h3 className="font-semibold text-slate-900 mb-4">
          Today's Assignments
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200">

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Time
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Customer
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Vehicle
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Pickup
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-slate-500"
                  >
                    Loading assignments...
                  </td>
                </tr>

              ) : todayTrips.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-slate-500"
                  >
                    No assignments for today.
                  </td>
                </tr>

              ) : (

                todayTrips.map((trip) => (

                  <tr
                    key={trip.id}
                    className="border-b border-slate-100"
                  >

                    <td className="py-3 px-4 text-slate-600">
                      {formatTime(trip.time)}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {trip.customer?.name || 'Customer'}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {trip.vehicle?.name || 'Vehicle'}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {trip.pickupLocation || 'Pickup location'}
                    </td>

                    <td className="py-3 px-4">

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'active'
                            ? 'badge-success'
                            : trip.status === 'completed'
                            ? 'badge-info'
                            : trip.status === 'cancelled'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }`}
                      >
                        {formatStatus(trip.status)}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Dashboard