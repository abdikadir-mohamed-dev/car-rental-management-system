import React from 'react'
import {
  Search,
  MapPin,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getBookings } from '../../services/driverService'

const tabs = [
  'All',
  'Confirmed',
  'Pending',
  'Completed',
  'Cancelled',
]

const statusStyle = {
  Confirmed: 'badge-success',
  Pending: 'badge-warning',
  Completed: 'badge-info',
  Cancelled: 'badge-danger',
  Active: 'badge-info',
}

const formatStatus = (status) => {
  if (!status) return 'Pending'

  const normalized = status.toLowerCase()

  switch (normalized) {
    case 'confirmed':
    case 'approved':
      return 'Confirmed'

    case 'pending':
      return 'Pending'

    case 'completed':
      return 'Completed'

    case 'cancelled':
    case 'canceled':
      return 'Cancelled'

    case 'active':
    case 'in_progress':
      return 'Active'

    default:
      return (
        status.charAt(0).toUpperCase() +
        status.slice(1).replace('_', ' ')
      )
  }
}

const formatDate = (date) => {
  if (!date) return '—'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatAmount = (amount) => {
  if (amount === null || amount === undefined) {
    return 'KSH 0'
  }

  return `KSH ${Number(amount).toLocaleString()}`
}

export default function DriverBookingsPage() {
  const [bookings, setBookings] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [tab, setTab] = React.useState('All')
  const [query, setQuery] = React.useState('')

  // ============================================================
  // LOAD REAL BOOKINGS
  // ============================================================

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getBookings()

      setBookings(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (error) {
      console.error(
        'Failed to load driver bookings:',
        error
      )

      const message =
        error.response?.data?.message ||
        'Failed to load bookings.'

      setError(message)

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // LOAD ON PAGE OPEN
  // ============================================================

  React.useEffect(() => {
    loadBookings()
  }, [])

  // ============================================================
  // FILTER BOOKINGS
  // ============================================================

  const filtered = bookings.filter((booking) => {
    const status = formatStatus(
      booking.status
    )

    const matchesTab =
      tab === 'All' ||
      status === tab

    const customerName =
      booking.customer?.name ||
      'Customer'

    const vehicleName =
      booking.vehicle?.name ||
      `${booking.vehicle?.make || ''} ${
        booking.vehicle?.model || ''
      }`.trim() ||
      'Vehicle'

    const bookingId =
      booking.displayId ||
      `BKG-${String(booking.id).padStart(4, '0')}`

    const searchText = query.toLowerCase()

    const matchesQuery =
      customerName
        .toLowerCase()
        .includes(searchText) ||
      bookingId
        .toLowerCase()
        .includes(searchText) ||
      vehicleName
        .toLowerCase()
        .includes(searchText)

    return matchesTab && matchesQuery
  })

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="p-6 space-y-6 overflow-y-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Bookings
          </h1>

          <p className="text-sm text-slate-500">
            {filtered.length}{' '}
            booking
            {filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search bookings..."
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />

        </div>

      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-200">

        {tabs.map((t) => (

          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>

        ))}

      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-xl shadow-sm p-5">

        {/* LOADING */}
        {loading && (

          <div className="flex items-center justify-center min-h-[200px]">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />

          </div>

        )}

        {/* ERROR */}
        {!loading && error && (

          <div className="py-10 text-center">

            <p className="text-red-500 mb-4">
              {error}
            </p>

            <button
              onClick={loadBookings}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90"
            >
              Try Again
            </button>

          </div>

        )}

        {/* TABLE */}
        {!loading && !error && (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">

                  <th className="pb-2 font-medium">
                    Booking ID
                  </th>

                  <th className="pb-2 font-medium">
                    Customer
                  </th>

                  <th className="pb-2 font-medium">
                    Vehicle
                  </th>

                  <th className="pb-2 font-medium">
                    Pickup
                  </th>

                  <th className="pb-2 font-medium">
                    Date
                  </th>

                  <th className="pb-2 font-medium">
                    Amount
                  </th>

                  <th className="pb-2 font-medium">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((booking) => {

                  const customer =
                    booking.customer || {}

                  const vehicle =
                    booking.vehicle || {}

                  const customerName =
                    customer.name ||
                    'Customer'

                  const vehicleName =
                    vehicle.name ||
                    `${vehicle.make || ''} ${
                      vehicle.model || ''
                    }`.trim() ||
                    'Vehicle'

                  const bookingId =
                    booking.displayId ||
                    `BKG-${String(
                      booking.id
                    ).padStart(4, '0')}`

                  const status =
                    formatStatus(
                      booking.status
                    )

                  const amount =
                    booking.totalAmount ??
                    booking.totalPrice ??
                    0

                  return (

                    <tr
                      key={booking.id}
                      className="border-b border-slate-50 last:border-0"
                    >

                      {/* BOOKING ID */}
                      <td className="py-3 text-slate-600">
                        {bookingId}
                      </td>

                      {/* CUSTOMER */}
                      <td className="py-3 text-slate-800 font-medium">
                        {customerName}
                      </td>

                      {/* VEHICLE */}
                      <td className="py-3 text-slate-600">
                        {vehicleName}
                      </td>

                      {/* PICKUP */}
                      <td className="py-3 text-slate-600">

                        <div className="flex items-center gap-1.5">

                          <MapPin
                            size={13}
                            className="text-slate-400"
                          />

                          <span>
                            {booking.pickupLocation ||
                              'Pickup location'}
                          </span>

                        </div>

                      </td>

                      {/* DATE */}
                      <td className="py-3 text-slate-600">
                        {formatDate(
                          booking.pickupDate
                        )}
                      </td>

                      {/* AMOUNT */}
                      <td className="py-3 text-slate-800 font-semibold">
                        {formatAmount(amount)}
                      </td>

                      {/* STATUS */}
                      <td className="py-3">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusStyle[status] ||
                            'badge-info'
                          }`}
                        >
                          {status}
                        </span>

                      </td>

                    </tr>

                  )

                })}

                {/* EMPTY */}
                {filtered.length === 0 && (

                  <tr>

                    <td
                      colSpan={7}
                      className="py-10 text-center text-slate-400"
                    >
                      No bookings match your search.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}