import { useState } from 'react'
import { Search, CheckCircle, XCircle } from 'lucide-react'

function VehicleInspection() {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Toyota Camry', plate: 'ABC 123', status: 'pending', condition: 'Good', notes: '' },
    { id: 2, name: 'Honda CR-V', plate: 'XYZ 789', status: 'pending', condition: '', notes: '' },
  ])
  const [search, setSearch] = useState('')

  const filteredVehicles = vehicles.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.plate?.toLowerCase().includes(search.toLowerCase())
  )

  const handleInspection = (id, passed) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, status: passed ? 'passed' : 'failed' } : v
    ))
  }

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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Plate</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Condition</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">{vehicle.name}</td>
                <td className="py-3 px-4 text-slate-600">{vehicle.plate}</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    placeholder="Enter condition"
                    className="input text-sm"
                    defaultValue={vehicle.condition}
                  />
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${vehicle.status === 'passed' ? 'badge-success' : vehicle.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleInspection(vehicle.id, true)} className="p-2 text-success hover:bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleInspection(vehicle.id, false)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VehicleInspection
