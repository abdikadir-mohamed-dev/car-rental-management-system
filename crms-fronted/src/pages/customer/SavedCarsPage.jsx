import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Users, Gauge, Fuel } from 'lucide-react'

import {
  getSavedCars,
  removeSavedCar,
} from '../../services/savedCarService'

import { mapVehicle } from '../../utils/apiMappers'
import toast from 'react-hot-toast'

function SavedCarsPage() {
  const [savedCars, setSavedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  // Load saved cars from PostgreSQL through the backend
  useEffect(() => {
    const loadSavedCars = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getSavedCars()

        const mappedCars = (data || [])
          .map((savedCar) => ({
            ...savedCar,
            vehicle: savedCar.vehicle
              ? mapVehicle(savedCar.vehicle)
              : null,
          }))
          .filter((savedCar) => savedCar.vehicle)

        setSavedCars(mappedCars)
      } catch (err) {
        console.error('Failed to load saved cars:', err)

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load saved cars'
        )
      } finally {
        setLoading(false)
      }
    }

    loadSavedCars()
  }, [])

  // Remove saved car from PostgreSQL
  const handleRemove = async (vehicleId) => {
    if (removingId) return

    try {
      setRemovingId(vehicleId)

      await removeSavedCar(vehicleId)

      setSavedCars((prev) =>
        prev.filter(
          (savedCar) => savedCar.vehicleId !== vehicleId
        )
      )

      toast.success('Car removed from saved cars')
    } catch (err) {
      console.error('Failed to remove saved car:', err)

      toast.error(
        err.response?.data?.message ||
        'Failed to remove saved car'
      )
    } finally {
      setRemovingId(null)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

          <p className="text-slate-500">
            Loading your saved cars...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">

        <Heart className="w-12 h-12 text-red-300 mx-auto mb-4" />

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Unable to load saved cars
        </h3>

        <p className="text-slate-500 mb-4">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>

      </div>
    )
  }

  return (
    <div>

      {/* PAGE HEADER */}
      <div className="mb-6">

        <div className="flex items-center gap-3 mb-2">

          <Heart className="w-7 h-7 text-red-500 fill-current" />

          <h1 className="text-3xl font-bold text-slate-900">
            Saved Cars
          </h1>

        </div>

        <p className="text-slate-600">
          Your favorite vehicles
        </p>

      </div>

      {/* EMPTY STATE */}
      {savedCars.length === 0 ? (

        <div className="card p-12 text-center">

          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No saved cars yet
          </h3>

          <p className="text-slate-600 mb-6">
            Start browsing and save your favorite vehicles.
          </p>

          <Link
            to="/customer/browse"
            className="btn-primary"
          >
            Browse Cars
          </Link>

        </div>

      ) : (

        <>
          {/* SAVED CAR COUNT */}
          <div className="mb-5">

            <p className="text-sm text-slate-500">
              {savedCars.length}{' '}
              {savedCars.length === 1
                ? 'car'
                : 'cars'} saved
            </p>

          </div>

          {/* SAVED CARS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {savedCars.map((savedCar) => {

              const vehicle = savedCar.vehicle

              if (!vehicle) return null

              const isRemoving =
                removingId === vehicle.id

              return (

                <div
                  key={savedCar.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >

                  {/* IMAGE */}
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">

                    <img
                      src={
                        vehicle.image ||
                        vehicle.images?.[0]
                      }
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() =>
                        handleRemove(vehicle.id)
                      }
                      disabled={isRemoving}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove from saved cars"
                    >

                      {isRemoving ? (

                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />

                      ) : (

                        <Heart className="w-5 h-5 text-red-500 fill-current" />

                      )}

                    </button>

                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-5 space-y-3">

                    {/* NAME + CATEGORY */}
                    <div>

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">

                          {vehicle.name}

                        </h3>

                        {vehicle.category && (

                          <span className="bg-blue-100 text-blue-700 capitalize text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">

                            {vehicle.category}

                          </span>

                        )}

                      </div>

                      <p className="text-sm text-slate-500">
                        {vehicle.brand}
                      </p>

                    </div>

                    {/* RATING */}
                    <div className="flex items-center gap-1">

                      <Star className="w-4 h-4 text-amber-400 fill-current" />

                      <span className="text-sm font-medium text-slate-700">
                        {vehicle.rating || 'N/A'}
                      </span>

                    </div>

                    {/* VEHICLE DETAILS */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">

                      {vehicle.seats && (

                        <span className="flex items-center gap-1">

                          <Users className="w-4 h-4" />

                          {vehicle.seats} seats

                        </span>

                      )}

                      {vehicle.transmission && (

                        <span className="flex items-center gap-1">

                          <Gauge className="w-4 h-4" />

                          {vehicle.transmission}

                        </span>

                      )}

                      {vehicle.fuelType && (

                        <span className="flex items-center gap-1">

                          <Fuel className="w-4 h-4" />

                          {vehicle.fuelType}

                        </span>

                      )}

                    </div>

                    {/* PRICE + DETAILS */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">

                      <div>

                        <span className="text-xl font-bold text-blue-600">

                          KES{' '}

                          {Number(
                            vehicle.pricePerDay || 0
                          ).toLocaleString()}

                        </span>

                        <span className="text-sm text-slate-500">
                          /day
                        </span>

                      </div>

                      <Link
                        to={`/customer/vehicles/${vehicle.id}`}
                        className="text-blue-600 font-medium text-sm hover:underline"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </div>

              )
            })}

          </div>
        </>

      )}

    </div>
  )
}

export default SavedCarsPage