import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Gauge, Fuel, Star, Heart } from 'lucide-react'

import {
  saveCar,
  removeSavedCar,
  checkSavedCar,
} from '../../services/savedCarService'

import toast from 'react-hot-toast'

function VehicleCard({ vehicle, to }) {
  const [liked, setLiked] = useState(false)
  const [saving, setSaving] = useState(false)

  const linkTo = to || `/vehicles/${vehicle.id}`

  // Check whether this vehicle is already saved
  useEffect(() => {
    let mounted = true

    const checkSaved = async () => {
      try {
        const saved = await checkSavedCar(vehicle.id)

        if (mounted) {
          setLiked(saved)
        }
      } catch (err) {
        console.error('Failed to check saved car:', err)
      }
    }

    checkSaved()

    return () => {
      mounted = false
    }
  }, [vehicle.id])

  // Save / remove vehicle
  const handleToggleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (saving) return

    try {
      setSaving(true)

      if (liked) {
        await removeSavedCar(vehicle.id)

        setLiked(false)

        toast.success('Car removed from saved cars')
      } else {
        await saveCar(vehicle.id)

        setLiked(true)

        toast.success('Car saved successfully')
      }
    } catch (err) {
      console.error('Failed to update saved car:', err)

      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to update saved car'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Link
      to={linkTo}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
    >
      <div className="aspect-video bg-slate-100 relative overflow-hidden">

        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* SAVE BUTTON */}
        <button
          type="button"
          onClick={handleToggleSave}
          disabled={saving}
          title={
            liked
              ? 'Remove from saved cars'
              : 'Save this car'
          }
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 ${
              liked
                ? 'text-red-500 fill-current'
                : 'text-slate-400'
            }`}
          />
        </button>

        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">

        <div>
          <div className="flex items-start justify-between gap-2">

            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {vehicle.name}
            </h3>

            <span className="bg-blue-100 text-blue-700 capitalize text-xs px-2 py-1 rounded-full font-medium">
              {vehicle.category}
            </span>

          </div>

          <p className="text-sm text-slate-500">
            {vehicle.brand}
          </p>
        </div>

        {/* RATING */}
        <div className="flex items-center gap-1">

          <Star className="w-4 h-4 text-amber-400 fill-current" />

          <span className="text-sm font-medium text-slate-700">
            {vehicle.rating}
          </span>

          <span className="text-sm text-slate-500">
            (120 reviews)
          </span>

        </div>

        {/* VEHICLE INFO */}
        <div className="flex items-center gap-4 text-sm text-slate-600">

          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {vehicle.seats} seats
          </span>

          <span className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            {vehicle.transmission}
          </span>

          <span className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            {vehicle.fuelType}
          </span>

        </div>

        {/* PRICE */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">

          <div>

            <span className="text-xl font-bold text-blue-600">
              KES {vehicle.pricePerDay}
            </span>

            <span className="text-sm text-slate-500">
              /day
            </span>

          </div>

          <span className="text-blue-600 font-medium text-sm group-hover:underline">
            View Details
          </span>

        </div>

      </div>
    </Link>
  )
}

export default VehicleCard