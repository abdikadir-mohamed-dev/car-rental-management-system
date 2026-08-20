import { useState, useEffect } from 'react'
import { getTrip, updateTripStatus } from '../../services/driverService'
import toast from 'react-hot-toast'
import { MapPin, User, Car, Clock } from 'lucide-react'

function TripDetails() {
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrip('current')
      .then((res) => setTrip(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = (status) => {
    updateTripStatus(trip._id, status)
      .then(() => {
        toast.success(`Trip marked as ${status}`)
        setTrip({ ...trip, status })
      })
      .catch(() => toast.error('Failed to update status'))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No active trip</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Current Trip</h3>
          <span className={`badge capitalize ${trip.status === 'in_progress' ? 'badge-info' : 'badge-warning'}`}>
            {trip.status?.replace('_', ' ')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <User className="w-5 h-5" />
              <div>
                <p className="text-sm text-slate-500">Customer</p>
                <p className="font-medium text-slate-900">{trip.customer?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Car className="w-5 h-5" />
              <div>
                <p className="text-sm text-slate-500">Vehicle</p>
                <p className="font-medium text-slate-900">{trip.vehicle?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm text-slate-500">Pickup Location</p>
                <p className="font-medium text-slate-900">{trip.pickupLocation || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm text-slate-500">Dropoff Location</p>
                <p className="font-medium text-slate-900">{trip.dropoffLocation || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-sm text-slate-500">Pickup Time</p>
                <p className="font-medium text-slate-900">{trip.pickupTime || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-sm text-slate-500">Dropoff Time</p>
                <p className="font-medium text-slate-900">{trip.dropoffTime || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        {trip.status === 'assigned' && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <button onClick={() => handleStatusUpdate('in_progress')} className="btn-primary">
              Start Trip
            </button>
          </div>
        )}
        {trip.status === 'in_progress' && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <button onClick={() => handleStatusUpdate('completed')} className="btn-success">
              Complete Trip
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetails
