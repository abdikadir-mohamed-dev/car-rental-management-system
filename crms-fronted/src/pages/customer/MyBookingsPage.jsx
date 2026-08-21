import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Calendar, CreditCard, MapPin, ArrowLeft, XCircle, Edit3, Printer, Download } from 'lucide-react'
import { mockVehicles } from '../../data/mockData'
import { mockDrivers } from '../../data/mockDrivers'
import { mockBookings } from '../../data/mockBookings'
import toast from 'react-hot-toast'

function MyBookingsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upcoming')
  const [bookings, setBookings] = useState(mockBookings)

  const filteredBookings = bookings.filter(b => b.status === activeTab)

  const selectedBooking = id ? bookings.find(b => b.id === id) : null

  if (selectedBooking) {
    const vehicle = mockVehicles.find(v => v.id === selectedBooking.vehicleId)
    const driver = selectedBooking.driverId ? mockDrivers.find(d => d.id === selectedBooking.driverId) : null
    const canCancel = selectedBooking.status === 'upcoming' || selectedBooking.status === 'active'

    const handleCancel = () => {
      setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b))
      toast.success('Booking cancelled successfully')
      navigate('/customer/my-bookings')
    }

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
                  <p className="font-medium text-slate-900">{selectedBooking.returnLocation}</p>
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
              {driver && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-medium text-slate-900 mb-2">Driver Information</p>
                  <div className="flex items-center gap-3">
                    <img src={driver.image} alt={driver.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-slate-900">{driver.name}</p>
                      <p className="text-sm text-slate-600">{driver.experience} · ⭐ {driver.rating}</p>
                      <p className="text-sm text-slate-600">{driver.languages}</p>
                    </div>
                  </div>
                </div>
              )}
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
                {selectedBooking.drivingOption === 'hire' && driver && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Driver ({selectedBooking.duration} days)</span>
                    <span className="font-medium text-slate-900">KES {(selectedBooking.driverPrice * selectedBooking.duration).toLocaleString()}</span>
                  </div>
                )}
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
                  <button onClick={handleCancel} className="btn-danger w-full flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </button>
                )}
                <button className="btn-secondary w-full flex items-center justify-center gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
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
            const vehicle = mockVehicles.find(v => v.id === booking.vehicleId)
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
                      {booking.driverId && (
                        <p>Driver: {mockDrivers.find(d => d.id === booking.driverId)?.name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/customer/my-bookings/${booking.id}`} className="btn-secondary text-sm">
                        View Details
                      </Link>
                      {(booking.status === 'upcoming' || booking.status === 'active') && (
                        <button onClick={() => handleCancel(booking.id)} className="btn-danger text-sm">
                          Cancel Booking
                        </button>
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
