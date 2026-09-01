import { useEffect, useState } from 'react'
import {
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getStaffBookings,
  checkinBooking,
} from '../../services/staffService'

function CheckinManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [selectedBooking, setSelectedBooking] =
    useState(null)

  const [mileage, setMileage] = useState('')
  const [fuelLevel, setFuelLevel] = useState('')
  const [condition, setCondition] = useState('')
  const [damage, setDamage] = useState('')
  const [lateReturn, setLateReturn] = useState(false)

  // =========================
  // GET TODAY'S DATE
  // =========================

  const getToday = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0')

    const day = String(
      today.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // =========================
  // LOAD BOOKINGS
  // =========================

  const loadBookings = async () => {
    try {
      setLoading(true)

      const response = await getStaffBookings()

      const list = Array.isArray(response)
        ? response
        : response?.bookings || []

      const today = getToday()

      /*
       * Check-in should show ONLY:
       *
       * status = active
       * return/dropoff date = today
       */

      const todaysCheckins = list.filter(
        (booking) => {
          const returnDate =
            booking?.dropoffDate ||
            booking?.dropoff_date ||
            booking?.returnDate ||
            booking?.return_date

          if (!returnDate) {
            return false
          }

          const bookingDate =
            String(returnDate).slice(0, 10)

          return (
            booking.status === 'active' &&
            bookingDate === today
          )
        }
      )

      setBookings(todaysCheckins)
    } catch (err) {
      console.error(
        'Failed to load check-in bookings:',
        err
      )

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load check-in bookings'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  // =========================
  // HELPERS
  // =========================

  const getBookingId = (booking) => {
    return (
      booking?.id ||
      booking?._id ||
      booking?.booking_id
    )
  }

  const getDisplayBookingId = (booking) => {
    const id = getBookingId(booking)

    if (!id) {
      return 'N/A'
    }

    if (String(id).startsWith('BKG-')) {
      return id
    }

    return `BKG-${String(id).padStart(4, '0')}`
  }

  const getCustomerName = (booking) => {
    return (
      booking?.customer?.name ||
      booking?.user?.name ||
      booking?.customer_name ||
      booking?.user_name ||
      'N/A'
    )
  }

  const getVehicleName = (booking) => {
    return (
      booking?.vehicle?.name ||
      booking?.vehicle_name ||
      'N/A'
    )
  }

  const getReturnDate = (booking) => {
    return (
      booking?.dropoffDate ||
      booking?.dropoff_date ||
      booking?.returnDate ||
      booking?.return_date ||
      'N/A'
    )
  }

  const getReturnLocation = (booking) => {
    return (
      booking?.dropoffLocation ||
      booking?.dropoff_location ||
      booking?.returnLocation ||
      booking?.return_location ||
      'N/A'
    )
  }

  // =========================
  // SEARCH
  // =========================

  const filteredBookings = bookings.filter(
    (booking) => {
      const searchLower =
        search.toLowerCase()

      return (
        getDisplayBookingId(booking)
          .toLowerCase()
          .includes(searchLower) ||
        getCustomerName(booking)
          .toLowerCase()
          .includes(searchLower) ||
        getVehicleName(booking)
          .toLowerCase()
          .includes(searchLower)
      )
    }
  )

  // =========================
  // OPEN CHECK-IN
  // =========================

  const handleCheckin = (booking) => {
    setSelectedBooking(booking)

    setMileage('')
    setFuelLevel('')
    setCondition('')
    setDamage('')
    setLateReturn(false)
  }

  // =========================
  // CONFIRM CHECK-IN
  // =========================

  const confirmCheckin = async () => {
    if (!selectedBooking) {
      return
    }

    if (!mileage || !fuelLevel || !condition) {
      toast.error(
        'Please fill in all vehicle details'
      )
      return
    }

    const bookingId =
      getBookingId(selectedBooking)

    try {
      await checkinBooking(bookingId, {
        mileage: Number(mileage),
        fuelLevel,
        condition,
        damage,
        lateReturn,
      })

      /*
       * Remove the booking from the list
       * because it is now completed.
       */

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) =>
            getBookingId(booking) !== bookingId
        )
      )

      setSelectedBooking(null)

      toast.success(
        'Vehicle checked in successfully'
      )
    } catch (err) {
      console.error(
        'Check-in failed:',
        err
      )

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Check-in failed'

      toast.error(message)
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[250px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search active bookings..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="input pl-10"
          />
        </div>
      </div>

      {/* Today's information */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-800">
          Showing active bookings scheduled
          for check-in today.
        </p>
      </div>

      {/* Table */}
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
                Return Date
              </th>

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                Location
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
            {filteredBookings.map(
              (booking) => (
                <tr
                  key={getBookingId(booking)}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="py-3 px-4 text-slate-900">
                    #{getDisplayBookingId(
                      booking
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {getCustomerName(booking)}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {getVehicleName(booking)}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {getReturnDate(booking)}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {getReturnLocation(
                      booking
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="badge badge-info capitalize">
                      {booking.status}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        handleCheckin(booking)
                      }
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Check-in
                    </button>
                  </td>

                </tr>
              )
            )}
          </tbody>

        </table>
      </div>

      {/* Empty state */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">

          <CheckCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />

          <p className="text-slate-500">
            No bookings scheduled for
            check-in today.
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Only active bookings with today's
            return date appear here.
          </p>

        </div>
      )}

      {/* Check-in Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">

              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Check-in
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {getDisplayBookingId(
                    selectedBooking
                  )}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>

            </div>

            <div className="p-6 space-y-4">

              {/* Booking information */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Customer
                  </p>

                  <p className="font-medium text-slate-900">
                    {getCustomerName(
                      selectedBooking
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Vehicle
                  </p>

                  <p className="font-medium text-slate-900">
                    {getVehicleName(
                      selectedBooking
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Return Date
                  </p>

                  <p className="font-medium text-slate-900">
                    {getReturnDate(
                      selectedBooking
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Return Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {getReturnLocation(
                      selectedBooking
                    )}
                  </p>
                </div>

              </div>

              {/* Mileage */}
              <div>
                <label className="label">
                  Ending Mileage (km)
                </label>

                <input
                  type="number"
                  min="0"
                  value={mileage}
                  onChange={(e) =>
                    setMileage(e.target.value)
                  }
                  className="input"
                  placeholder="e.g. 45600"
                />
              </div>

              {/* Fuel */}
              <div>
                <label className="label">
                  Fuel Level
                </label>

                <select
                  value={fuelLevel}
                  onChange={(e) =>
                    setFuelLevel(e.target.value)
                  }
                  className="input"
                >
                  <option value="">
                    Select
                  </option>

                  <option value="full">
                    Full
                  </option>

                  <option value="3/4">
                    3/4
                  </option>

                  <option value="1/2">
                    1/2
                  </option>

                  <option value="1/4">
                    1/4
                  </option>

                  <option value="empty">
                    Empty
                  </option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="label">
                  Vehicle Condition
                </label>

                <input
                  type="text"
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value)
                  }
                  className="input"
                  placeholder="e.g. Good, minor scratch"
                />
              </div>

              {/* Damage */}
              <div>
                <label className="label">
                  Damage Notes
                </label>

                <textarea
                  value={damage}
                  onChange={(e) =>
                    setDamage(e.target.value)
                  }
                  className="input"
                  rows="3"
                  placeholder="Describe any damage..."
                />
              </div>

              {/* Late return */}
              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  id="lateReturn"
                  checked={lateReturn}
                  onChange={(e) =>
                    setLateReturn(
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-primary rounded"
                />

                <label
                  htmlFor="lateReturn"
                  className="text-sm text-slate-700"
                >
                  Late return
                </label>

              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={confirmCheckin}
                className="btn-primary flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Check-in
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default CheckinManagement