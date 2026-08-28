import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { Eye, Check, X, Search, XCircle, Filter } from 'lucide-react'
import { BOOKING_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'
import { updateStaffBookingStatus, checkoutBooking, checkinBooking } from '../../services/staffService'

function BookingManagement({ onView }) {
  const dispatch = useDispatch()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const loadBookings = () => {
    setLoading(true)
    setError(null)
    dispatch(fetchBookings({}))
      .unwrap()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res.bookings || [])
        setBookings(list)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load bookings')
        toast.error(err.message || 'Failed to load bookings')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED: return 'badge-success'
      case BOOKING_STATUS.PENDING: return 'badge-warning'
      case BOOKING_STATUS.CANCELLED: return 'badge-danger'
      case BOOKING_STATUS.COMPLETED: return 'badge-info'
      default: return 'badge-gray'
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateStaffBookingStatus(bookingId, newStatus)
      setBookings(bookings.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b)))
      toast.success(`Booking status updated to ${newStatus}`)
    } catch (err) {
      toast.error(err.message || 'Failed to update booking')
    }
  }

  const handleCheckout = async (booking) => {
    try {
      await checkoutBooking(booking._id, { mileage: 0, fuelLevel: 'full', condition: 'good' })
      setBookings(bookings.map(b => (b._id === booking._id ? { ...b, status: 'active' } : b)))
      toast.success('Vehicle checked out')
      setSelectedBooking(null)
    } catch (err) {
      toast.error(err.message || 'Checkout failed')
    }
  }

  const handleCheckin = async (booking) => {
    try {
      await checkinBooking(booking._id, { mileage: 0, fuelLevel: 'full', condition: 'good', damage: '' })
      setBookings(bookings.map(b => (b._id === booking._id ? { ...b, status: 'completed' } : b)))
      toast.success('Vehicle checked in')
      setSelectedBooking(null)
    } catch (err) {
      toast.error(err.message || 'Check-in failed')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const searchLower = search.toLowerCase()
    const matchesSearch = !search ||
      booking._id?.toLowerCase().includes(searchLower) ||
      booking.vehicle?.name?.toLowerCase().includes(searchLower) ||
      booking.user?.name?.toLowerCase().includes(searchLower) ||
      booking.pickupLocation?.toLowerCase().includes(searchLower) ||
      booking.dropoffLocation?.toLowerCase().includes(searchLower)
    const matchesStatus = !statusFilter || booking.status === statusFilter
    const matchesDate = !dateFilter || booking.pickupDate === dateFilter || booking.dropoffDate === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
          <button onClick={loadBookings} className="ml-2 underline">Retry</button>
        </div>
      )}
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
            placeholder="Filter by date"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-48">
          <option value="">All Statuses</option>
          {Object.values(BOOKING_STATUS).map((status) => (
            <option key={status} value={status} className="capitalize">{status}</option>
          ))}
        </select>
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
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Dates</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">#{booking._id?.slice(-8)}</td>
                  <td className="py-3 px-4 text-slate-600">{booking.vehicle?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-600">{booking.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-600">{booking.pickupDate} - {booking.dropoffDate}</td>
                  <td className="py-3 px-4">
                    <span className={`badge capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedBooking(booking)} className="p-2 text-primary hover:bg-primary-light rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status === BOOKING_STATUS.PENDING && (
                        <>
                          <button onClick={() => updateBookingStatus(booking._id, BOOKING_STATUS.CONFIRMED)} className="p-2 text-success hover:bg-emerald-50 rounded-lg" title="Confirm">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateBookingStatus(booking._id, BOOKING_STATUS.CANCELLED)} className="p-2 text-danger hover:bg-red-50 rounded-lg" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {booking.status === BOOKING_STATUS.CONFIRMED && (
                        <button onClick={() => handleCheckout(booking)} className="p-2 text-success hover:bg-emerald-50 rounded-lg" title="Check-out">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status === 'active' && (
                        <button onClick={() => handleCheckin(booking)} className="p-2 text-primary hover:bg-primary-light rounded-lg" title="Check-in">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <p className="text-center text-slate-500 py-8">No bookings found.</p>
          )}
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Booking ID</p>
                  <p className="font-medium text-slate-900">#{selectedBooking._id?.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`badge capitalize ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-medium text-slate-900">{selectedBooking.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="font-medium text-slate-900">{selectedBooking.vehicle?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup Date</p>
                  <p className="font-medium text-slate-900">{selectedBooking.pickupDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Return Date</p>
                  <p className="font-medium text-slate-900">{selectedBooking.dropoffDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup Location</p>
                  <p className="font-medium text-slate-900">{selectedBooking.pickupLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dropoff Location</p>
                  <p className="font-medium text-slate-900">{selectedBooking.dropoffLocation || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setSelectedBooking(null)} className="btn-secondary">
                Close
              </button>
              {selectedBooking.status === BOOKING_STATUS.PENDING && (
                <>
                  <button onClick={() => { updateBookingStatus(selectedBooking._id, BOOKING_STATUS.CANCELLED); setSelectedBooking(null); }} className="btn-danger">
                    Cancel
                  </button>
                  <button onClick={() => { updateBookingStatus(selectedBooking._id, BOOKING_STATUS.CONFIRMED); setSelectedBooking(null); }} className="btn-primary">
                    Confirm
                  </button>
                </>
              )}
              {selectedBooking.status === BOOKING_STATUS.CONFIRMED && (
                <button onClick={() => { handleCheckout(selectedBooking); setSelectedBooking(null); }} className="btn-primary">
                  Check-out
                </button>
              )}
              {selectedBooking.status === 'active' && (
                <button onClick={() => { handleCheckin(selectedBooking); setSelectedBooking(null); }} className="btn-primary">
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
