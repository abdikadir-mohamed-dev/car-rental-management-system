import { useState, useEffect } from 'react'
import { Search, Wrench, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { getVehicles } from '../../services/vehicleService'
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

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        const data = await getVehicles()
        setVehicles((data || []).map(v => ({ ...mapVehicle(v), maintenance: false, maintenanceNotes: '' })))
      } catch (err) {
        setError(err.message || 'Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }
    loadVehicles()
  }, [])

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.brand?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = !showMaintenanceOnly || v.maintenance
    return matchesSearch && matchesFilter
  })

  const handleFlagMaintenance = (vehicle) => {
    setSelectedVehicle(vehicle)
    setMaintenanceNotes(vehicle.maintenanceNotes || '')
  }

  const confirmMaintenance = () => {
    setVehicles(vehicles.map(v =>
      v.id === selectedVehicle.id
        ? { ...v, maintenance: true, maintenanceNotes, available: false }
        : v
    ))
    toast.success(`${selectedVehicle.name} flagged for maintenance`)
    setSelectedVehicle(null)
    setMaintenanceNotes('')
  }

  const releaseMaintenance = (vehicleId) => {
    setVehicles(vehicles.map(v =>
      v.id === vehicleId
        ? { ...v, maintenance: false, maintenanceNotes: '', available: true }
        : v
    ))
    toast.success('Vehicle released back to available pool')
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
          <p className="text-slate-600">Manage fleet and flag vehicles for maintenance</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, brand, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowMaintenanceOnly(!showMaintenanceOnly)}
            className={`btn-secondary flex items-center gap-2 ${showMaintenanceOnly ? 'bg-amber-50 border-amber-200' : ''}`}
          >
            <Wrench className="w-4 h-4" />
            {showMaintenanceOnly ? 'Show All Vehicles' : 'Show Maintenance Only'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Brand</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Location</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className={`border-b border-slate-100 hover:bg-slate-50 ${vehicle.maintenance ? 'bg-amber-50' : ''}`}>
                  <td className="py-3 px-4 text-slate-900 font-medium">{vehicle.name}</td>
                  <td className="py-3 px-4 text-slate-600">{vehicle.brand}</td>
                  <td className="py-3 px-4 text-slate-600">{vehicle.category}</td>
                  <td className="py-3 px-4 text-slate-600">{vehicle.location}</td>
                  <td className="py-3 px-4">
                    {vehicle.maintenance ? (
                      <span className="badge badge-warning">Maintenance</span>
                    ) : (
                      <span className={`badge ${vehicle.available ? 'badge-success' : 'badge-danger'}`}>
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {!vehicle.maintenance ? (
                        <button onClick={() => handleFlagMaintenance(vehicle)} className="btn-danger text-sm px-3 py-1 flex items-center gap-1">
                          <Wrench className="w-4 h-4" />
                          Flag Maintenance
                        </button>
                      ) : (
                        <button onClick={() => releaseMaintenance(vehicle.id)} className="btn-primary text-sm px-3 py-1 flex items-center gap-1">
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
            <p className="text-center text-slate-500 py-8">No vehicles found.</p>
          )}
        </div>
      </div>

      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Flag for Maintenance</h3>
              <button onClick={() => { setSelectedVehicle(null); setMaintenanceNotes(''); }} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="font-medium text-slate-900">{selectedVehicle.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Brand</p>
                  <p className="font-medium text-slate-900">{selectedVehicle.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-medium text-slate-900">{selectedVehicle.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">{selectedVehicle.location}</p>
                </div>
              </div>
              <div>
                <label className="label">Maintenance Notes</label>
                <textarea
                  value={maintenanceNotes}
                  onChange={(e) => setMaintenanceNotes(e.target.value)}
                  className="input"
                  rows="3"
                  placeholder="Describe the maintenance issue..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setSelectedVehicle(null); setMaintenanceNotes(''); }} className="btn-secondary">
                Cancel
              </button>
              <button onClick={confirmMaintenance} className="btn-danger flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Flag for Maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StaffVehiclesPage
