import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import { Link } from 'react-router-dom'
import { Car, MapPin, Phone, AlertTriangle, RefreshCw, Clock } from 'lucide-react'
import { BOOKING_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'

function ActiveRentalPage() {
  const dispatch = useDispatch()
  const { bookings = [], loading } = useSelector((state) => state.bookings || {})
  const { vehicles = [] } = useSelector((state) => state.vehicles || {})

  useEffect(() => {
    dispatch(fetchBookings({ status: BOOKING_STATUS.CONFIRMED }))
    dispatch(fetchVehicles({}))
  }, [dispatch])

  const now = new Date()
  const activeRentals = bookings.filter(
    (b) =>
      b.status === BOOKING_STATUS.CONFIRMED &&
      new Date(b.pickupDate) <= now &&
      new Date(b.dropoffDate) >= now
  )

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Active Rental</h1>
        <p className="text-slate-600 mt-1">Your currently active vehicle rental</p>
      </div>

      {activeRentals.length === 0 ? (
        <div className="card p-12 text-center">
          <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No active rental</h3>
          <p className="text-slate-500 mb-6">You don't have an active rental at the moment.</p>
          <Link to="/customer/vehicles" className="btn-primary">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activeRentals.map((booking) => {
            const vehicle = booking.vehicle || {}
            const daysLeft = Math.ceil((new Date(booking.dropoffDate) - now) / (1000 * 60 * 60 * 24))
            const isUrgent = daysLeft <= 1

            return (
              <div key={booking._id} className="card overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold text-slate-900">{vehicle.name || 'Vehicle'}</h3>
                            <StatusBadge status={booking.status} type="success" />
                          </div>
                          <p className="text-sm text-slate-500 capitalize">{vehicle.type} - {vehicle.brand} {vehicle.model}</p>
                        </div>
                        {isUrgent && (
                          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            Due soon
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Pickup Location</p>
                            <p className="font-medium text-slate-900">{booking.pickupLocation || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Dropoff Location</p>
                            <p className="font-medium text-slate-900">{booking.dropoffLocation || 'Not specified'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Emergency Contact</p>
                            <p className="font-medium text-slate-900">+1 (555) 123-4567</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Return In</p>
                            <p className="font-medium text-slate-900">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link to={`/customer/bookings/${booking._id}`} className="btn-primary flex-1">View Details</Link>
                        <Link to={`/customer/agreements/${booking._id}`} className="btn-secondary flex-1">View Agreement</Link>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 flex flex-col">
                    <h4 className="font-semibold text-slate-900 mb-4">Rental Summary</h4>
                    <div className="flex-1 space-y-3">
                      <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                        {vehicle.image ? (
                          <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                        ) : (
                          <Car className="w-full h-full text-slate-400 p-4" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Pickup</span>
                          <span className="font-medium">{formatDateUtil(booking.pickupDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Dropoff</span>
                          <span className="font-medium">{formatDateUtil(booking.dropoffDate)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Reference</span>
                          <span className="font-medium">#{booking._id?.slice(-8)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="font-semibold text-slate-900">Total</span>
                          <span className="font-bold text-primary">{formatCurrency(booking.totalAmount || 0)}</span>
                        </div>
                      </div>
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

export default ActiveRentalPage
