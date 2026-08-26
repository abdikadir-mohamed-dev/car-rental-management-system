import { useState, useEffect } from 'react'
import { Eye, Search } from 'lucide-react'
import { BOOKING_STATUS } from '../../utils/constants'
import { getBookings } from '../../services/adminService'

function BookingManagement({ onView }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const loadBookings = async () => {
    setLoading(true)
    try {
      const response = await getBookings()
      setBookings(response.data.bookings || response.data)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      (booking.id && booking.id.toString().toLowerCase().includes(searchText)) ||
      (booking._id && booking._id.toString().toLowerCase().includes(searchText)) ||
      (booking.vehicle && booking.vehicle.name && booking.vehicle.name.toLowerCase().includes(searchText)) ||
      (booking.customer && booking.customer.name && booking.customer.name.toLowerCase().includes(searchText)) ||
      (booking.user && booking.user.name && booking.user.name.toLowerCase().includes(searchText))

    const matchesStatus =
      !statusFilter || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                  key={booking.id || booking._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="py-3 px-4 text-slate-900">
                    #{booking.id || booking._id}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.customer?.name || booking.user?.name || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.vehicle?.name || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.pickupDate} - {booking.returnDate}
                  </td>

                   <td className="py-3 px-4 font-medium text-slate-900">
                     KES {booking.totalAmount?.toLocaleString()}
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