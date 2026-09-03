import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Edit,
  Trash2,
  Search,
} from 'lucide-react'

import ConfirmDialog from '../../components/common/ConfirmDialog'

import {
  getVehicles,
  deleteVehicle,
} from '../../services/adminService'

// ============================================================
// NORMALIZE VEHICLE
// ============================================================

const normalizeVehicle = (vehicle) => {
  const id =
    vehicle?.id ??
    vehicle?._id

  const make =
    vehicle?.make ??
    vehicle?.brand ??
    ''

  const model =
    vehicle?.model ??
    ''

  const vehicleType =
    vehicle?.vehicleType ??
    vehicle?.vehicle_type ??
    vehicle?.type ??
    vehicle?.category ??
    ''

  const dailyRentalRate =
    vehicle?.dailyRentalRate ??
    vehicle?.daily_rental_rate ??
    vehicle?.pricePerDay ??
    vehicle?.price_per_day ??
    0

  const seatingCapacity =
    vehicle?.seatingCapacity ??
    vehicle?.seating_capacity ??
    vehicle?.seats ??
    0

  const images = Array.isArray(
    vehicle?.images
  )
    ? vehicle.images
    : vehicle?.image
      ? [vehicle.image]
      : []

  const image =
    images[0] ||
    vehicle?.image ||
    ''

  const available =
    vehicle?.available ??
    vehicle?.isAvailable ??
    vehicle?.is_available ??
    false

  return {
    ...vehicle,

    id,

    _id:
      vehicle?._id ??
      String(id),

    make,

    brand: make,

    model,

    name:
      vehicle?.name ||
      `${make} ${model}`.trim(),

    vehicleType,

    category: vehicleType,

    dailyRentalRate:
      Number(dailyRentalRate) || 0,

    pricePerDay:
      Number(dailyRentalRate) || 0,

    seatingCapacity,

    seats: seatingCapacity,

    images,

    image,

    available,
  }
}

// ============================================================
// COMPONENT
// ============================================================

function VehicleManagement({ onEdit }) {
  const [vehicles, setVehicles] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  const [search, setSearch] =
    useState('')

  const [deleteId, setDeleteId] =
    useState(null)

  const [confirmOpen, setConfirmOpen] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  // ============================================================
  // LOAD VEHICLES
  // ============================================================

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response =
        await getVehicles()

      /*
       * Some endpoints return:
       *
       * [...]
       *
       * while others return:
       *
       * { vehicles: [...] }
       */

      const rawVehicles =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.vehicles)
            ? response.vehicles
            : []

      const normalizedVehicles =
        rawVehicles.map(
          normalizeVehicle
        )

      setVehicles(
        normalizedVehicles
      )
    } catch (err) {
      console.error(
        'Failed to load vehicles:',
        err
      )

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load vehicles'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDeleteConfirm =
    async () => {
      setConfirmOpen(false)

      if (!deleteId) {
        return
      }

      try {
        setDeleting(true)

        await deleteVehicle(
          deleteId
        )

        setVehicles((prev) =>
          prev.filter(
            (vehicle) =>
              vehicle.id !== deleteId &&
              vehicle._id !== deleteId &&
              String(vehicle.id) !==
                String(deleteId) &&
              String(vehicle._id) !==
                String(deleteId)
          )
        )

        toast.success(
          'Vehicle deleted successfully'
        )
      } catch (err) {
        console.error(
          'Failed to delete vehicle:',
          err
        )

        toast.error(
          err.response?.data?.message ||
          err.message ||
          'Failed to delete vehicle'
        )
      } finally {
        setDeleting(false)
        setDeleteId(null)
      }
    }

  const handleDeleteCancel = () => {
    setConfirmOpen(false)
    setDeleteId(null)
  }

  // ============================================================
  // SEARCH
  // ============================================================

  const searchTerm =
    search.toLowerCase().trim()

  const filteredVehicles =
    vehicles.filter((vehicle) => {
      const name =
        vehicle.name?.toLowerCase() ||
        ''

      const make =
        vehicle.make?.toLowerCase() ||
        ''

      const model =
        vehicle.model?.toLowerCase() ||
        ''

      const type =
        vehicle.vehicleType?.toLowerCase() ||
        ''

      return (
        name.includes(searchTerm) ||
        make.includes(searchTerm) ||
        model.includes(searchTerm) ||
        type.includes(searchTerm)
      )
    })

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div>

      {/* ERROR */}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between gap-3">
          <span>{error}</span>

          <button
            onClick={loadVehicles}
            className="underline font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* SEARCH */}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="input pl-10"
          />
        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : (

        /* TABLE */

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200">

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Image
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Vehicle
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Type
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Price/Day
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

              {filteredVehicles.map(
                (vehicle) => {

                  const vehicleId =
                    vehicle.id ??
                    vehicle._id

                  const image =
                    vehicle.image ||
                    vehicle.images?.[0] ||
                    ''

                  return (
                    <tr
                      key={vehicleId}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      {/* IMAGE */}

                      <td className="py-3 px-4">

                        {image ? (
                          <img
                            src={image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none'

                              e.currentTarget.parentElement.innerHTML =
                                '<div class="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">No image</div>'
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                            No image
                          </div>
                        )}

                      </td>

                      {/* VEHICLE */}

                      <td className="py-3 px-4">

                        <div className="font-medium text-slate-900">
                          {vehicle.make ||
                          vehicle.brand ||
                          'Unknown'}
                        </div>

                        <div className="text-sm text-slate-500">
                          {vehicle.model ||
                          'Unknown model'}
                        </div>

                      </td>

                      {/* TYPE */}

                      <td className="py-3 px-4 text-slate-600 capitalize">
                        {vehicle.vehicleType ||
                          vehicle.category ||
                          '—'}
                      </td>

                      {/* PRICE */}

                      <td className="py-3 px-4 text-slate-600">

                        <span className="font-medium text-slate-900">
                          KES{' '}
                          {Number(
                            vehicle.dailyRentalRate ??
                              vehicle.pricePerDay ??
                              0
                          ).toLocaleString()}
                        </span>

                        <span className="text-xs text-slate-400 ml-1">
                          / day
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="py-3 px-4">

                        <span
                          className={`badge ${
                            vehicle.available
                              ? 'badge-success'
                              : 'badge-danger'
                          }`}
                        >
                          {vehicle.available
                            ? 'Available'
                            : 'Unavailable'}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="py-3 px-4">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              onEdit?.(
                                vehicle
                              )
                            }
                            className="p-2 text-primary hover:bg-primary-light rounded-lg"
                            title="Edit vehicle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClick(
                                vehicleId
                              )
                            }
                            disabled={deleting}
                            className="p-2 text-danger hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

          {/* EMPTY */}

          {filteredVehicles.length ===
            0 && (
            <p className="text-center text-slate-500 py-8">
              {search
                ? 'No vehicles match your search.'
                : 'No vehicles found.'}
            </p>
          )}

        </div>
      )}

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        onConfirm={
          handleDeleteConfirm
        }
        onCancel={
          handleDeleteCancel
        }
        confirmText="Yes, Delete"
      />

    </div>
  )
}

export default VehicleManagement