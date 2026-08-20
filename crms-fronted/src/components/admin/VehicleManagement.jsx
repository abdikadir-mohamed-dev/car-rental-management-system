import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Edit, Trash2, Search } from 'lucide-react'
import ConfirmDialog from '../../components/common/ConfirmDialog'

function VehicleManagement({ onEdit }) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const mockVehicles = [
    { _id: 'V001', name: 'Toyota RAV4', type: 'SUV', pricePerDay: 80, available: true, brand: 'Toyota' },
    { _id: 'V002', name: 'Honda Accord', type: 'Sedan', pricePerDay: 65, available: true, brand: 'Honda' },
    { _id: 'V003', name: 'BMW 3 Series', type: 'Luxury', pricePerDay: 120, available: false, brand: 'BMW' },
    { _id: 'V004', name: 'Mercedes C-Class', type: 'Luxury', pricePerDay: 140, available: true, brand: 'Mercedes' },
    { _id: 'V005', name: 'Nissan X-Trail', type: 'SUV', pricePerDay: 75, available: true, brand: 'Nissan' },
  ]

  const loadVehicles = () => {
    setLoading(true)
    setTimeout(() => {
      setVehicles(mockVehicles)
      setLoading(false)
    }, 600)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVehicles()
  }, [])

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDeleteConfirm = () => {
    setConfirmOpen(false)
    if (deleteId) {
      setVehicles(vehicles.filter(v => v._id !== deleteId))
      toast.success('Vehicle deleted')
      setDeleteId(null)
    }
  }

  const handleDeleteCancel = () => {
    setConfirmOpen(false)
    setDeleteId(null)
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
                  <td className="py-3 px-4 text-slate-600">KES {vehicle.pricePerDay.toLocaleString()}</td>
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
                      <button onClick={() => handleDeleteClick(vehicle._id)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
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
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Yes, Delete"
      />
    </div>
  )
}

export default VehicleManagement
