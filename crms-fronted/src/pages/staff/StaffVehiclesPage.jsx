import { useState, useEffect } from 'react'
import {
  Search,
  Wrench,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { getVehicles } from '../../services/vehicleService'
import { flagVehicleMaintenance } from '../../services/maintenanceService'
import { mapVehicle } from '../../utils/apiMappers'
import toast from 'react-hot-toast'

function StaffVehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showMaintenanceOnly, setShowMaintenanceOnly] = useState(false)

  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [maintenanceNotes, setMaintenanceNotes] = useState('')
  const [maintenancePriority, setMaintenancePriority] = useState('Medium')
  const [submittingMaintenance, setSubmittingMaintenance] = useState(false)

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
          (data || []).map(v => ({
            ...mapVehicle(v),

            // Use backend vehicle status to determine
            // whether the vehicle is already in maintenance.
            maintenance:
              v.status === 'maintenance' ||
              v.status === 'under_maintenance',

            maintenanceNotes: '',
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

  const filteredVehicles = vehicles.filter(vehicle => {
    const searchTerm = search.toLowerCase()

    const matchesSearch =
      vehicle.name?.toLowerCase().includes(searchTerm) ||
      vehicle.brand?.toLowerCase().includes(searchTerm) ||
      vehicle.location?.toLowerCase().includes(searchTerm)

    const matchesFilter =
      !showMaintenanceOnly || vehicle.maintenance

    return matchesSearch && matchesFilter
  })

  // =========================================================
  // OPEN MAINTENANCE MODAL
  // =========================================================

  const handleFlagMaintenance = vehicle => {
    setSelectedVehicle(vehicle)
    setMaintenanceNotes(vehicle.maintenanceNotes || '')
    setMaintenancePriority('Medium')
  }

  // =========================================================
  // CONFIRM MAINTENANCE
  // =========================================================

  const confirmMaintenance = async () => {
    if (!selectedVehicle) {
      return
    }

    const issue = maintenanceNotes.trim()

    if (!issue) {
      toast.error('Please describe the maintenance issue')
      return
    }

    try {
      setSubmittingMaintenance(true)

      const response = await flagVehicleMaintenance(
        selectedVehicle.id,
        {
          issue,
          priority: maintenancePriority,
        }
      )

      console.log(
        'Vehicle maintenance created:',
        response
      )

      // Update local UI only after backend succeeds.
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle =>
          vehicle.id === selectedVehicle.id
            ? {
                ...vehicle,
                maintenance: true,
                maintenanceNotes: issue,
                available: false,
                status: 'maintenance',
              }
            : vehicle
        )
      )

      toast.success(
        `${selectedVehicle.name} flagged for maintenance`
      )

      setSelectedVehicle(null)
      setMaintenanceNotes('')
      setMaintenancePriority('Medium')

    } catch (err) {
      console.error(
        'Failed to flag vehicle maintenance:',
        err
      )

      toast.error(
        err.response?.data?.message ||
        'Failed to flag vehicle for maintenance'
      )

    } finally {
      setSubmittingMaintenance(false)
    }
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeMaintenanceModal = () => {
    if (submittingMaintenance) {
      return
    }

    setSelectedVehicle(null)
    setMaintenanceNotes('')
    setMaintenancePriority('Medium')
  }

  // =========================================================
  // RELEASE VEHICLE
  // =========================================================

  const releaseMaintenance = vehicleId => {
    /*
     * NOTE:
     * The current backend does not yet have a release-maintenance
     * endpoint. Therefore, we should NOT pretend this is persisted
     * in the database.
     *
     * For now this only changes the frontend state.
     *
     * We can add the proper backend release endpoint next.
     */

    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === vehicleId
          ? {
              ...vehicle,
              maintenance: false,
              maintenanceNotes: '',
              available: true,
              status: 'available',
            }
          : vehicle
      )
    )

    toast.success(
      'Vehicle released back to available pool'
    )
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
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
        <p className="text-slate-500">
          {error}
        </p>
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Vehicles
          </h1>

          <p className="text-slate-600">
            Manage fleet and flag vehicles for maintenance
          </p>
        </div>
      </div>

      {/* =====================================================
          VEHICLES CARD
      ====================================================== */}

      <div className="card p-6">

        {/* SEARCH + FILTER */}

        <div className="flex flex-col sm:flex-row gap-4 mb-4">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, brand, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10"
            />

          </div>

          <button
            onClick={() =>
              setShowMaintenanceOnly(!showMaintenanceOnly)
            }
            className={`btn-secondary flex items-center gap-2 ${
              showMaintenanceOnly
                ? 'bg-amber-50 border-amber-200'
                : ''
            }`}
          >
            <Wrench className="w-4 h-4" />

            {showMaintenanceOnly
              ? 'Show All Vehicles'
              : 'Show Maintenance Only'}
          </button>

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

              {filteredVehicles.map(vehicle => (

                <tr
                  key={vehicle.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 ${
                    vehicle.maintenance
                      ? 'bg-amber-50'
                      : ''
                  }`}
                >

                  <td className="py-3 px-4 text-slate-900 font-medium">
                    {vehicle.name}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {vehicle.brand}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {vehicle.category}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {vehicle.location}
                  </td>

                  <td className="py-3 px-4">

                    {vehicle.maintenance ? (

                      <span className="badge badge-warning">
                        Maintenance
                      </span>

                    ) : (

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

                    )}

                  </td>

                  <td className="py-3 px-4">

                    <div className="flex gap-2">

                      {!vehicle.maintenance ? (

                        <button
                          onClick={() =>
                            handleFlagMaintenance(vehicle)
                          }
                          className="btn-danger text-sm px-3 py-1 flex items-center gap-1"
                        >
                          <Wrench className="w-4 h-4" />

                          Flag Maintenance
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            releaseMaintenance(vehicle.id)
                          }
                          className="btn-primary text-sm px-3 py-1 flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />

                          Release
                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredVehicles.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No vehicles found.
            </p>
          )}

        </div>

      </div>

      {/* =====================================================
          MAINTENANCE MODAL
      ====================================================== */}

      {selectedVehicle && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="p-6 border-b border-slate-200 flex items-center justify-between">

              <h3 className="text-lg font-semibold text-slate-900">
                Flag for Maintenance
              </h3>

              <button
                onClick={closeMaintenanceModal}
                disabled={submittingMaintenance}
                className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Vehicle
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedVehicle.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Brand
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedVehicle.brand}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Category
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedVehicle.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedVehicle.location}
                  </p>
                </div>

              </div>

              {/* ISSUE */}

              <div>

                <label className="label">
                  Maintenance Issue
                </label>

                <textarea
                  value={maintenanceNotes}
                  onChange={e =>
                    setMaintenanceNotes(e.target.value)
                  }
                  className="input"
                  rows="3"
                  placeholder="Describe the maintenance issue..."
                  disabled={submittingMaintenance}
                />

              </div>

              {/* PRIORITY */}

              <div>

                <label className="label">
                  Priority
                </label>

                <select
                  value={maintenancePriority}
                  onChange={e =>
                    setMaintenancePriority(e.target.value)
                  }
                  className="input"
                  disabled={submittingMaintenance}
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">

              <button
                onClick={closeMaintenanceModal}
                disabled={submittingMaintenance}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={confirmMaintenance}
                disabled={submittingMaintenance}
                className="btn-danger flex items-center gap-2 disabled:opacity-50"
              >

                <Wrench className="w-4 h-4" />

                {submittingMaintenance
                  ? 'Flagging...'
                  : 'Flag for Maintenance'}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default StaffVehiclesPage