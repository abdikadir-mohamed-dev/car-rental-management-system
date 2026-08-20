import { useState, useEffect } from 'react'
import { Eye, Search } from 'lucide-react'
import { BOOKING_STATUS } from '../../utils/constants'

function BookingManagement({ onView }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Temporary frontend mock data
  const mockBookings = [
    {
      _id: 'BK001',
      customer: { name: 'John Doe' },
      user: { name: 'John Doe' },
      vehicle: { name: 'Toyota RAV4' },
      pickupDate: 'May 20, 2025',
      dropoffDate: 'May 24, 2025',
      totalAmount: 275,
      status: BOOKING_STATUS.CONFIRMED
    },
    {
      _id: 'BK002',
      customer: { name: 'Mary Wanjiku' },
      user: { name: 'Mary Wanjiku' },
      vehicle: { name: 'Honda Accord' },
      pickupDate: 'May 21, 2025',
      dropoffDate: 'May 27, 2025',
      totalAmount: 510,
      status: BOOKING_STATUS.CONFIRMED
    },
    {
      _id: 'BK003',
      customer: { name: 'Peter Mwangi' },
      user: { name: 'Peter Mwangi' },
      vehicle: { name: 'BMW 3 Series' },
      pickupDate: 'May 22, 2025',
      dropoffDate: 'May 25, 2025',
      totalAmount: 340,
      status: BOOKING_STATUS.PENDING
    },
    {
      _id: 'BK004',
      customer: { name: 'Ali Hassan' },
      user: { name: 'Ali Hassan' },
      vehicle: { name: 'Mercedes C-Class' },
      pickupDate: 'May 22, 2025',
      dropoffDate: 'May 29, 2025',
      totalAmount: 420,
      status: BOOKING_STATUS.CONFIRMED
    },
    {
      _id: 'BK005',
      customer: { name: 'James Kamau' },
      user: { name: 'James Kamau' },
      vehicle: { name: 'Toyota RAV4' },
      pickupDate: 'May 24, 2025',
      dropoffDate: 'May 28, 2025',
      totalAmount: 310,
      status: BOOKING_STATUS.CANCELLED
    }
  ]

  const loadBookings = () => {
    setLoading(true)

    // Simulate loading from a server
    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 500)
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
      booking.customer?.name?.toLowerCase().includes(searchText)

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
                  key={booking._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="py-3 px-4 text-slate-900">
                    #{booking._id}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.customer?.name || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.vehicle?.name || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {booking.pickupDate} - {booking.dropoffDate}
                  </td>

                   <td className="py-3 px-4 font-medium text-slate-900">
                     KES {booking.totalAmount.toLocaleString()}
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