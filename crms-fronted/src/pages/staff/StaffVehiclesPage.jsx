import { useState, useEffect } from 'react'
import {
  Search,
  Eye,
  X,
} from 'lucide-react'
import { getVehicles } from '../../services/vehicleService'
import { mapVehicle } from '../../utils/apiMappers'

function StaffVehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // =========================================================
  // LOAD VEHICLES
  // =========================================================

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getVehicles()

        setVehicles(
          (data || []).map((vehicle) => ({
            ...mapVehicle(vehicle),
            rawVehicle: vehicle,
          }))
        )
      } catch (err) {
        console.error('Failed to load vehicles:', err)

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load vehicles'
        )
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  // =========================================================
  // FILTER VEHICLES
  // =========================================================

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchTerm = search.toLowerCase().trim()

    if (!searchTerm) {
      return true
    }

    return (
      vehicle.name?.toLowerCase().includes(searchTerm) ||
      vehicle.brand?.toLowerCase().includes(searchTerm) ||
      vehicle.model?.toLowerCase().includes(searchTerm) ||
      vehicle.category?.toLowerCase().includes(searchTerm) ||
      vehicle.location?.toLowerCase().includes(searchTerm)
    )
  })

  // =========================================================
  // OPEN VEHICLE DETAILS
  // =========================================================

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
  }

  // =========================================================
  // CLOSE VEHICLE DETAILS
  // =========================================================

  const closeVehicleDetails = () => {
    setSelectedVehicle(null)
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="card p-6 max-w-lg mx-auto">
          <p className="text-red-600 mb-4">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Vehicles
        </h1>

        <p className="text-slate-600 mt-1">
          View fleet vehicles and their availability
        </p>
      </div>

      {/* =====================================================
          VEHICLES CARD
      ====================================================== */}

      <div className="card p-6">

        {/* SEARCH */}

        <div className="mb-6">
          <div className="relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, brand, model, category, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />

          </div>
        </div>

        {/* VEHICLE TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-200">

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Vehicle
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Brand
                </th>

                <th className="text-left py-3 px-4 font-medium text-slate-600">
                  Category
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

              {filteredVehicles.map((vehicle) => (

                <tr
                  key={vehicle.id ?? vehicle._id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  {/* VEHICLE */}

                  <td className="py-3 px-4">

                    <div className="flex items-center gap-3">

                      {vehicle.image || vehicle.images?.[0] ? (
                        <img
                          src={
                            vehicle.image ||
                            vehicle.images?.[0]
                          }
                          alt={vehicle.name || 'Vehicle'}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="text-xs text-slate-400">
                            No Image
                          </span>
                        </div>
                      )}

                      <div>

                        <p className="font-medium text-slate-900">
                          {vehicle.name || 'Unnamed Vehicle'}
                        </p>

                        {vehicle.model && (
                          <p className="text-sm text-slate-500">
                            {vehicle.model}
                          </p>
                        )}

                      </div>

                    </div>

                  </td>

                  {/* BRAND */}

                  <td className="py-3 px-4 text-slate-600">
                    {vehicle.brand || '—'}
                  </td>

                  {/* CATEGORY */}

                  <td className="py-3 px-4 text-slate-600 capitalize">
                    {vehicle.category || vehicle.type || '—'}
                  </td>

                  {/* LOCATION */}

                  <td className="py-3 px-4 text-slate-600">
                    {vehicle.location || '—'}
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

                    <button
                      onClick={() =>
                        handleViewVehicle(vehicle)
                      }
                      className="btn-secondary text-sm px-3 py-2 flex items-center gap-2"
                    >

                      <Eye className="w-4 h-4" />

                      View

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* EMPTY STATE */}

          {filteredVehicles.length === 0 && (
            <div className="text-center py-10">

              <p className="text-slate-500">
                No vehicles found.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          VEHICLE DETAILS MODAL
      ====================================================== */}

      {selectedVehicle && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>

                <h2 className="text-xl font-semibold text-slate-900">
                  Vehicle Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Vehicle information
                </p>

              </div>

              <button
                onClick={closeVehicleDetails}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-6">

              {/* IMAGE */}

              <div className="flex justify-center">

                {selectedVehicle.image ||
                selectedVehicle.images?.[0] ? (

                  <img
                    src={
                      selectedVehicle.image ||
                      selectedVehicle.images?.[0]
                    }
                    alt={
                      selectedVehicle.name ||
                      'Vehicle'
                    }
                    className="w-full max-w-md h-56 object-cover rounded-xl"
                  />

                ) : (

                  <div className="w-full max-w-md h-56 rounded-xl bg-slate-100 flex items-center justify-center">

                    <span className="text-slate-400">
                      No vehicle image
                    </span>

                  </div>

                )}

              </div>

              {/* BASIC INFORMATION */}

              <div>

                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Vehicle Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <DetailItem
                    label="Vehicle"
                    value={
                      selectedVehicle.name ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Brand"
                    value={
                      selectedVehicle.brand ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Model"
                    value={
                      selectedVehicle.model ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Type"
                    value={
                      selectedVehicle.category ||
                      selectedVehicle.type ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Year"
                    value={
                      selectedVehicle.year ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Seats"
                    value={
                      selectedVehicle.seats ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Transmission"
                    value={
                      selectedVehicle.transmission ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Fuel Type"
                    value={
                      selectedVehicle.fuelType ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Location"
                    value={
                      selectedVehicle.location ||
                      '—'
                    }
                  />

                  <DetailItem
                    label="Price Per Day"
                    value={
                      selectedVehicle.pricePerDay !==
                      undefined &&
                      selectedVehicle.pricePerDay !==
                      null
                        ? `KES ${Number(
                            selectedVehicle.pricePerDay
                          ).toLocaleString()}`
                        : '—'
                    }
                  />

                </div>

              </div>

              {/* STATUS */}

              <div className="border-t border-slate-200 pt-5">

                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Availability
                </h3>

                <span
                  className={`badge ${
                    selectedVehicle.available
                      ? 'badge-success'
                      : 'badge-danger'
                  }`}
                >
                  {selectedVehicle.available
                    ? 'Available'
                    : 'Unavailable'}
                </span>

              </div>

              {/* FEATURES */}

              {selectedVehicle.features &&
                selectedVehicle.features.length > 0 && (

                  <div className="border-t border-slate-200 pt-5">

                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Features
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {selectedVehicle.features.map(
                        (feature, index) => (

                          <span
                            key={`${feature}-${index}`}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm"
                          >
                            {feature}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                )}

              {/* DESCRIPTION */}

              {selectedVehicle.description && (

                <div className="border-t border-slate-200 pt-5">

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Description
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {selectedVehicle.description}
                  </p>

                </div>

              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="p-6 border-t border-slate-200 flex justify-end">

              <button
                onClick={closeVehicleDetails}
                className="btn-secondary"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

// =============================================================
// DETAIL ITEM
// =============================================================

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-medium text-slate-900 mt-1 capitalize">
        {value}
      </p>
    </div>
  )
}

export default StaffVehiclesPage