import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchVehicles, deleteVehicle } from '../../redux/slices/vehicleSlice'
import toast from 'react-hot-toast'
import { Edit, Trash2, Search } from 'lucide-react'

function VehicleManagement({ onEdit }) {
  const dispatch = useDispatch()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadVehicles = () => {
    setLoading(true)
    dispatch(fetchVehicles({}))
      .unwrap()
      .then((res) => setVehicles(res.data.vehicles || res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVehicles()
  }, [])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id)
        .unwrap()
        .then(() => {
          toast.success('Vehicle deleted')
          loadVehicles()
        })
        .catch((err) => toast.error(err))
    }
  }

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name?.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.brand?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Price/Day</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">{vehicle.name}</td>
                  <td className="py-3 px-4 capitalize text-slate-600">{vehicle.type}</td>
                  <td className="py-3 px-4 text-slate-600">${vehicle.pricePerDay}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${vehicle.available ? 'badge-success' : 'badge-danger'}`}>
                      {vehicle.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit?.(vehicle)} className="p-2 text-primary hover:bg-primary-light rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(vehicle._id)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
      )}
    </div>
  )
}

export default VehicleManagement
