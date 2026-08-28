import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Calendar, CreditCard, MapPin, ArrowLeft, XCircle, Edit3, Printer, Download, FileText } from 'lucide-react'
import { getBookings, cancelBooking, updateBooking } from '../../services/bookingService'
import { mapBooking } from '../../utils/apiMappers'
import toast from 'react-hot-toast'

function MyBookingsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingBooking, setEditingBooking] = useState(null)
  const [editPickup, setEditPickup] = useState('')
  const [editReturn, setEditReturn] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const bookingsData = await getBookings()
        setBookings((bookingsData || []).map(mapBooking))
      } catch (err) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredBookings = bookings.filter(b => b.status === activeTab)

  const selectedBooking = id ? bookings.find(b => b.id === id) : null

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId)
      setBookings(bookings.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)))
      toast.success('Booking cancelled successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking')
    }
  }

  const handleSaveModify = async () => {
    if (!editPickup || !editReturn) {
      toast.error('Please select both dates')
      return
    }
    if (new Date(editReturn) <= new Date(editPickup)) {
      toast.error('Return date must be after pickup date')
      return
    }
    try {
      const days = Math.max(1, Math.ceil((new Date(editReturn) - new Date(editPickup)) / (1000 * 60 * 60 * 24)))
      const updated = await updateBooking(editingBooking.id, {
        pickupDate: editPickup,
        returnDate: editReturn,
        dropoffDate: editReturn,
      })
      setBookings(bookings.map(b => (b.id === editingBooking.id ? { ...b, ...updated, pickupDate: editPickup, returnDate: editReturn, duration: days } : b)))
      toast.success('Booking updated successfully')
      setEditingBooking(null)
    } catch (err) {
      toast.error(err.message || 'Failed to update booking')
    }
  }

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

  if (selectedBooking) {
    const vehicle = selectedBooking.vehicle
    const canCancel = selectedBooking.status === 'upcoming' || selectedBooking.status === 'active'

    return (
      <div>
        <button onClick={() => navigate('/customer/my-bookings')} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to My Bookings
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Details</h1>
        <p className="text-slate-600 mb-6">Booking #{selectedBooking.id}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Vehicle Information</h2>
              <div className="flex gap-4">
                <img src={vehicle?.image} alt={vehicle?.name} className="w-32 h-24 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-slate-900">{vehicle?.name}</h3>
                  <p className="text-sm text-slate-600">{vehicle?.category} · {vehicle?.brand}</p>
                  <p className="text-sm text-slate-600">{vehicle?.seats} seats · {vehicle?.transmission} · {vehicle?.fuelType}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Rental Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Pickup Date</p>
                      <p className="font-medium text-slate-900">{selectedBooking.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Return Date</p>
                      <p className="font-medium text-slate-900">{selectedBooking.returnDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Pickup Location</p>
                      <p className="font-medium text-slate-900">{selectedBooking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Return Location</p>
                      <p className="font-medium text-slate-900">{selectedBooking.dropoffLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Duration</p>
                      <p className="font-medium text-slate-900">{selectedBooking.duration} Days</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Driving Option</p>
                      <p className="font-medium text-slate-900">{selectedBooking.drivingOption === 'hire' ? 'Hire a Driver' : 'Self Drive'}</p>
                    </div>
                  </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Payment Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Vehicle ({selectedBooking.duration} days)</span>
                      <span className="font-medium text-slate-900">KES {(selectedBooking.vehiclePrice * selectedBooking.duration).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-blue-600">KES {selectedBooking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              <div className="space-y-2">
                {canCancel && (
                  <button onClick={() => handleCancel(selectedBooking.id)} className="btn-danger w-full flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </button>
                )}
                {canCancel && (
                  <button onClick={() => handleModify(selectedBooking)} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Modify Booking
                  </button>
                )}
                <Link to={`/customer/agreements/${selectedBooking.id}`} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Agreement
                </Link>
                <button className="btn-secondary w-full flex items-center justify-center gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>

        {editingBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Modify Booking</h2>
                <p className="text-sm text-slate-600">Update your booking dates</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pick-up Date</label>
                  <input
                    type="date"
                    value={editPickup}
                    onChange={(e) => setEditPickup(e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
                  <input
                    type="date"
                    value={editReturn}
                    onChange={(e) => setEditReturn(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex gap-3">
                <button onClick={handleSaveModify} className="btn-primary flex-1">Save Changes</button>
                <button onClick={() => setEditingBooking(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
      <p className="text-slate-600 mb-6">Manage your rentals</p>

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-4">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No {activeTab} bookings</h3>
          <p className="text-slate-600 mb-4">
            {activeTab === 'upcoming' ? "You don't have any upcoming bookings." : `No ${activeTab} bookings yet.`}
          </p>
          <Link to="/customer/browse" className="btn-primary">Browse Cars</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const vehicle = booking.vehicle
            return (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={vehicle?.image}
                    alt={vehicle?.name}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{vehicle?.name}</h3>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium capitalize ${
                          booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          booking.status === 'completed' ? 'bg-emerald-100 text-success' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-danger' : 'bg-amber-100 text-warning'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-blue-600">KES {booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-4">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {booking.pickupLocation}
                      </p>
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {booking.pickupDate} - {booking.returnDate}
                      </p>
                      <p>{booking.duration} Days · {booking.drivingOption === 'hire' ? 'Hire a Driver' : 'Self Drive'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/customer/my-bookings/${booking.id}`} className="btn-secondary text-sm">
                        View Details
                      </Link>
                      {(booking.status === 'upcoming' || booking.status === 'active') && (
                        <>
                          <button onClick={() => handleModify(booking)} className="btn-secondary text-sm flex items-center gap-1">
                            <Edit3 className="w-4 h-4" />
                            Modify
                          </button>
                          <button onClick={() => handleCancel(booking.id)} className="btn-danger text-sm">
                            Cancel Booking
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBookingsPage
