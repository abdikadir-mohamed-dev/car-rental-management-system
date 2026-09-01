import { useState, useEffect } from 'react'
import {
  Eye,
  Check,
  X,
  Search,
  XCircle,
  Filter,
} from 'lucide-react'
import { BOOKING_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'

import {
  getPendingBookings,
  updateStaffBookingStatus,
  checkoutBooking,
  checkinBooking,
} from '../../services/staffService'

function BookingManagement({ onView }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Load bookings that customers have submitted
  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPendingBookings()

      const list = Array.isArray(response)
        ? response
        : response?.bookings || []

      setBookings(list)
    } catch (err) {
      console.error('Failed to load staff bookings:', err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load bookings'

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const getBookingId = (booking) => {
    return booking?._id || booking?.id || booking?.booking_id
  }

  const getCustomerName = (booking) => {
    return (
      booking?.user?.name ||
      booking?.customer?.name ||
      booking?.customer?.full_name ||
      booking?.user_name ||
      booking?.customer_name ||
      'N/A'
    )
  }

  const getVehicleName = (booking) => {
    return (
      booking?.vehicle?.name ||
      booking?.vehicle?.model ||
      booking?.vehicle_name ||
      booking?.vehicle?.registration_number ||
      'N/A'
    )
  }

  const getPickupDate = (booking) => {
    return (
      booking?.pickupDate ||
      booking?.pickup_date ||
      booking?.start_date ||
      'N/A'
    )
  }

  const getDropoffDate = (booking) => {
    return (
      booking?.dropoffDate ||
      booking?.dropoff_date ||
      booking?.end_date ||
      'N/A'
    )
  }

  const getPickupLocation = (booking) => {
    return (
      booking?.pickupLocation ||
      booking?.pickup_location ||
      'N/A'
    )
  }

  const getDropoffLocation = (booking) => {
    return (
      booking?.dropoffLocation ||
      booking?.dropoff_location ||
      'N/A'
    )
  }

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

      case 'active':
        return 'badge-success'

      default:
        return 'badge-gray'
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateStaffBookingStatus(bookingId, newStatus)

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          getBookingId(booking) === bookingId
            ? {
                ...booking,
                status: newStatus,
              }
            : booking
        )
      )

      setSelectedBooking((current) =>
        current
          ? {
              ...current,
              status: newStatus,
            }
          : null
      )

      toast.success(`Booking status updated to ${newStatus}`)
    } catch (err) {
      console.error('Failed to update booking:', err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update booking'

      toast.error(message)
    }
  }

  const handleCheckout = async (booking) => {
    const bookingId = getBookingId(booking)

    try {
      await checkoutBooking(bookingId, {
        mileage: 0,
        fuelLevel: 'full',
        condition: 'good',
      })

      setBookings((currentBookings) =>
        currentBookings.map((item) =>
          getBookingId(item) === bookingId
            ? {
                ...item,
                status: 'active',
              }
            : item
        )
      )

      toast.success('Vehicle checked out')
      setSelectedBooking(null)
    } catch (err) {
      console.error('Checkout failed:', err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Checkout failed'

      toast.error(message)
    }
  }

  const handleCheckin = async (booking) => {
    const bookingId = getBookingId(booking)

    try {
      await checkinBooking(bookingId, {
        mileage: 0,
        fuelLevel: 'full',
        condition: 'good',
        damage: '',
      })

      setBookings((currentBookings) =>
        currentBookings.map((item) =>
          getBookingId(item) === bookingId
            ? {
                ...item,
                status: 'completed',
              }
            : item
        )
      )

      toast.success('Vehicle checked in')
      setSelectedBooking(null)
    } catch (err) {
      console.error('Check-in failed:', err)

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Check-in failed'

      toast.error(message)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = search.toLowerCase()

    const bookingId = String(getBookingId(booking) || '').toLowerCase()
    const customerName = getCustomerName(booking).toLowerCase()
    const vehicleName = getVehicleName(booking).toLowerCase()
    const pickupLocation = getPickupLocation(booking).toLowerCase()
    const dropoffLocation = getDropoffLocation(booking).toLowerCase()

    const matchesSearch =
      !search ||
      bookingId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      vehicleName.includes(searchLower) ||
      pickupLocation.includes(searchLower) ||
      dropoffLocation.includes(searchLower)

    const matchesStatus =
      !statusFilter ||
      booking.status === statusFilter

    const matchesDate =
      !dateFilter ||
      getPickupDate(booking) === dateFilter ||
      getDropoffDate(booking) === dateFilter

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div>
      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}

          <button
            onClick={loadBookings}
            className="ml-2 underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search by booking ID, customer, vehicle, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input sm:w-48"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
                  Vehicle
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Customer
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Dates
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
              {filteredBookings.map((booking) => {
                const bookingId = getBookingId(booking)

                return (
                  <tr
                    key={bookingId}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 text-slate-900">
                      #{String(bookingId || '').slice(-8)}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {getVehicleName(booking)}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {getCustomerName(booking)}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {getPickupDate(booking)} - {getDropoffDate(booking)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`badge capitalize ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status || 'pending'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {/* View */}
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)

                            if (onView) {
                              onView(booking)
                            }
                          }}
                          className="p-2 text-primary hover:bg-primary-light rounded-lg"
                          title="View booking"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Pending */}
                        {booking.status === BOOKING_STATUS.PENDING && (
                          <>
                            <button
                              onClick={() =>
                                updateBookingStatus(
                                  bookingId,
                                  BOOKING_STATUS.CONFIRMED
                                )
                              }
                              className="p-2 text-success hover:bg-emerald-50 rounded-lg"
                              title="Confirm"
                            >
                              <Check className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                updateBookingStatus(
                                  bookingId,
                                  BOOKING_STATUS.CANCELLED
                                )
                              }
                              className="p-2 text-danger hover:bg-red-50 rounded-lg"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Confirmed */}
                        {booking.status === BOOKING_STATUS.CONFIRMED && (
                          <button
                            onClick={() => handleCheckout(booking)}
                            className="p-2 text-success hover:bg-emerald-50 rounded-lg"
                            title="Check-out"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {/* Active */}
                        {booking.status === 'active' && (
                          <button
                            onClick={() => handleCheckin(booking)}
                            className="p-2 text-primary hover:bg-primary-light rounded-lg"
                            title="Check-in"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No bookings found.
            </p>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Booking Details
              </h3>

              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Booking ID
                  </p>

                  <p className="font-medium text-slate-900">
                    #{String(getBookingId(selectedBooking) || '').slice(-8)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <span
                    className={`badge capitalize ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Customer
                  </p>

                  <p className="font-medium text-slate-900">
                    {getCustomerName(selectedBooking)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Vehicle
                  </p>

                  <p className="font-medium text-slate-900">
                    {getVehicleName(selectedBooking)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Pickup Date
                  </p>

                  <p className="font-medium text-slate-900">
                    {getPickupDate(selectedBooking)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Return Date
                  </p>

                  <p className="font-medium text-slate-900">
                    {getDropoffDate(selectedBooking)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Pickup Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {getPickupLocation(selectedBooking)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Dropoff Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {getDropoffLocation(selectedBooking)}
                  </p>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-secondary"
              >
                Close
              </button>

              {selectedBooking.status === BOOKING_STATUS.PENDING && (
                <>
                  <button
                    onClick={() => {
                      updateBookingStatus(
                        getBookingId(selectedBooking),
                        BOOKING_STATUS.CANCELLED
                      )
                      setSelectedBooking(null)
                    }}
                    className="btn-danger"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      updateBookingStatus(
                        getBookingId(selectedBooking),
                        BOOKING_STATUS.CONFIRMED
                      )
                      setSelectedBooking(null)
                    }}
                    className="btn-primary"
                  >
                    Confirm
                  </button>
                </>
              )}

              {selectedBooking.status === BOOKING_STATUS.CONFIRMED && (
                <button
                  onClick={() => handleCheckout(selectedBooking)}
                  className="btn-primary"
                >
                  Check-out
                </button>
              )}

              {selectedBooking.status === 'active' && (
                <button
                  onClick={() => handleCheckin(selectedBooking)}
                  className="btn-primary"
                >
                  Check-in
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagement