import { useState, useEffect } from 'react'
import { Eye, Search } from 'lucide-react'
import { BOOKING_STATUS } from '../../utils/constants'
import { getBookings } from '../../services/adminService'
import { mapBooking } from '../../utils/apiMappers'

function BookingManagement({ onView }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getBookings()
      const list = Array.isArray(data) ? data : (data.bookings || [])
      setBookings(list.map(mapBooking))
    } catch (err) {
      setError(err.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'badge-success'

      case BOOKING_STATUS.PENDING:
        return 'badge-warning'

      case BOOKING_STATUS.CANCELLED:
        return 'badge-danger'

      case BOOKING_STATUS.COMPLETED:
        return 'badge-info'

      default:
        return 'badge-gray'
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      booking._id?.toLowerCase().includes(searchText) ||
      booking.vehicle?.name?.toLowerCase().includes(searchText) ||
      booking.user?.name?.toLowerCase().includes(searchText)

    const matchesStatus =
      !statusFilter || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
          <button onClick={loadBookings} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input sm:w-48"
        >
          <option value="">All Statuses</option>

          {Object.values(BOOKING_STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200">

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  ID
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Customer
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Vehicle
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Dates
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Amount
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Status
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredBookings.map((booking) => (

                <tr
                  key={booking._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="py-3 px-4 text-slate-900">
                    #{booking._id}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.user?.name || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.vehicle?.name || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.pickupDate} - {booking.dropoffDate}
                  </td>

                   <td className="py-3 px-4 font-medium text-slate-900">
                     KES {(booking.totalAmount || 0).toLocaleString()}
                   </td>

                  <td className="py-3 px-4">

                    <span
                      className={`badge capitalize ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </td>

                  <td className="py-3 px-4">

                    <button
                      onClick={() => onView?.(booking)}
                      className="p-2 text-primary hover:bg-primary-light rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredBookings.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No bookings found.
            </p>
          )}

        </div>

      )}

    </div>
  )
}

export default BookingManagement
