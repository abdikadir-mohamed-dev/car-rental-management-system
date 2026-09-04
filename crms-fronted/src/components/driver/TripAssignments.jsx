import { useState, useEffect } from 'react'
import {
  MapPin,
  User,
  Car,
  Loader2,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getTrips,
  updateTripStatus,
} from '../../services/driverService'

function TripAssignments() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')

  // ============================================================
  // LOAD REAL TRIPS FROM BACKEND
  // ============================================================

  const loadTrips = async () => {
    try {
      setLoading(true)

      const data = await getTrips()

      setTrips(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load trips:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to load trips'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  // ============================================================
  // UPDATE TRIP STATUS
  // ============================================================

  const handleStatusUpdate = async (tripId, status) => {
    try {
      setUpdatingId(tripId)

      const updatedTrip = await updateTripStatus(
        tripId,
        status
      )

      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === tripId
            ? updatedTrip
            : trip
        )
      )

      toast.success(
        status === 'active'
          ? 'Trip started'
          : status === 'completed'
          ? 'Trip completed'
          : 'Trip cancelled'
      )
    } catch (error) {
      console.error(
        'Failed to update trip status:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to update trip status'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // ============================================================
  // FILTER TRIPS
  // ============================================================

  const filteredTrips = trips.filter((trip) => {
    if (activeTab === 'upcoming') {
      return trip.status === 'upcoming'
    }

    if (activeTab === 'active') {
      return (
        trip.status === 'active' ||
        trip.status === 'in_progress'
      )
    }

    if (activeTab === 'completed') {
      return trip.status === 'completed'
    }

    return true
  })

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return 'Not specified'

    return new Date(date).toLocaleDateString(
      'en-KE',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    )
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div>

      {/* TABS */}

      <div className="flex flex-wrap gap-2 mb-6">

        {[
          'upcoming',
          'active',
          'completed',
        ].map((tab) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() +
              tab.slice(1)}
          </button>

        ))}

      </div>

      {/* TRIPS */}

      <div className="space-y-4">

        {filteredTrips.map((trip) => (

          <div
            key={trip.id}
            className="card p-5"
          >

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              {/* TRIP INFORMATION */}

              <div className="space-y-3">

                {/* Trip ID */}

                <div>
                  <p className="text-xs text-slate-400">
                    Trip
                  </p>

                  <p className="font-semibold text-slate-900">
                    TRP-{String(trip.id).padStart(3, '0')}
                  </p>
                </div>

                {/* Customer */}

                <div className="flex items-center gap-2 text-slate-600">

                  <User className="w-4 h-4" />

                  <span>
                    Customer #{trip.customer_id || 'N/A'}
                  </span>

                </div>

                {/* Vehicle */}

                <div className="flex items-center gap-2 text-slate-600">

                  <Car className="w-4 h-4" />

                  <span>
                    Vehicle #{trip.vehicle_id || 'N/A'}
                  </span>

                </div>

                {/* Pickup */}

                <div className="flex items-center gap-2 text-slate-600">

                  <MapPin className="w-4 h-4" />

                  <span>
                    {trip.pickup_location ||
                      'Pickup location not specified'}
                  </span>

                </div>

                {/* Dropoff */}

                <div className="flex items-center gap-2 text-slate-600">

                  <MapPin className="w-4 h-4" />

                  <span>
                    {trip.dropoff_location ||
                      'Drop-off location not specified'}
                  </span>

                </div>

                {/* Date */}

                <div className="flex items-center gap-2 text-slate-600">

                  <Calendar className="w-4 h-4" />

                  <span>
                    {formatDate(trip.date)}
                  </span>

                </div>

                {/* Time */}

                <div className="flex items-center gap-2 text-slate-600">

                  <Clock className="w-4 h-4" />

                  <span>
                    {trip.time || 'Time not specified'}
                  </span>

                </div>

                {/* Fare */}

                <div className="flex items-center gap-2 text-slate-600">

                  <DollarSign className="w-4 h-4" />

                  <span>
                    KES {trip.fare ?? '0'}
                  </span>

                </div>

              </div>

              {/* RIGHT SIDE */}

              <div className="flex flex-col items-end gap-3">

                {/* STATUS */}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : trip.status === 'active' ||
                        trip.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-700'
                      : trip.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {trip.status}
                </span>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-2">

                  {/* START TRIP */}

                  {trip.status === 'upcoming' && (

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          trip.id,
                          'active'
                        )
                      }
                      disabled={
                        updatingId === trip.id
                      }
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      {updatingId === trip.id ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={15} />
                          Start Trip
                        </>
                      )}
                    </button>

                  )}

                  {/* COMPLETE TRIP */}

                  {(trip.status === 'active' ||
                    trip.status === 'in_progress') && (

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          trip.id,
                          'completed'
                        )
                      }
                      disabled={
                        updatingId === trip.id
                      }
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      {updatingId === trip.id ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={15} />
                          Complete Trip
                        </>
                      )}
                    </button>

                  )}

                  {/* CANCEL TRIP */}

                  {(trip.status === 'upcoming' ||
                    trip.status === 'active' ||
                    trip.status === 'in_progress') && (

                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          trip.id,
                          'cancelled'
                        )
                      }
                      disabled={
                        updatingId === trip.id
                      }
                      className="flex items-center gap-2 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      <XCircle size={15} />
                      Cancel
                    </button>

                  )}

                </div>

              </div>

            </div>

          </div>

        ))}

        {/* EMPTY STATE */}

        {filteredTrips.length === 0 && (

          <div className="bg-white rounded-xl p-10 text-center">

            <Car className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <h3 className="font-semibold text-slate-700">
              No trips found
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              You currently have no{' '}
              {activeTab} trips.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}

export default TripAssignments