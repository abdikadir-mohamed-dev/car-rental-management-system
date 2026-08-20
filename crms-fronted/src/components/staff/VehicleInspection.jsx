import { useState } from 'react'
import { Search, CheckCircle, XCircle, ClipboardList } from 'lucide-react'

function VehicleInspection() {
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Toyota Camry', plate: 'ABC 123', status: 'pending', condition: '', mileage: '', fuelLevel: '', notes: '', type: 'check-out' },
    { id: 2, name: 'Honda CR-V', plate: 'XYZ 789', status: 'pending', condition: '', mileage: '', fuelLevel: '', notes: '', type: 'check-out' },
  ])
  const [search, setSearch] = useState('')
  const [history] = useState([
    { id: 101, vehicle: 'Toyota Camry', plate: 'ABC 123', type: 'Check-in', date: '2026-08-18', inspector: 'Staff A', status: 'passed', notes: 'Minor scratch on rear bumper' },
    { id: 102, vehicle: 'Honda CR-V', plate: 'XYZ 789', type: 'Check-out', date: '2026-08-17', inspector: 'Staff B', status: 'passed', notes: 'Good condition' },
  ])

  const filteredVehicles = vehicles.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.plate?.toLowerCase().includes(search.toLowerCase())
  )

  const handleInspection = (id, passed) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, status: passed ? 'passed' : 'failed' } : v
    ))
  }

  const updateVehicle = (id, field, value) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  return (
    <div className="space-y-6">
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
              <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Mileage</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Fuel Level</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Condition</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Damage Notes</th>
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
                  <select
                    value={vehicle.type}
                    onChange={(e) => updateVehicle(vehicle.id, 'type', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="check-out">Check-out</option>
                    <option value="check-in">Check-in</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    placeholder="0 km"
                    className="input text-sm w-24"
                    value={vehicle.mileage}
                    onChange={(e) => updateVehicle(vehicle.id, 'mileage', e.target.value)}
                  />
                </td>
                <td className="py-3 px-4">
                  <select
                    value={vehicle.fuelLevel}
                    onChange={(e) => updateVehicle(vehicle.id, 'fuelLevel', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Full">Full</option>
                    <option value="3/4">3/4</option>
                    <option value="1/2">1/2</option>
                    <option value="1/4">1/4</option>
                    <option value="Empty">Empty</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    placeholder="Enter condition"
                    className="input text-sm"
                    value={vehicle.condition}
                    onChange={(e) => updateVehicle(vehicle.id, 'condition', e.target.value)}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    placeholder="Damage notes"
                    className="input text-sm"
                    value={vehicle.notes}
                    onChange={(e) => updateVehicle(vehicle.id, 'notes', e.target.value)}
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

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Inspection History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Plate</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Inspector</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Notes</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">{record.vehicle}</td>
                  <td className="py-3 px-4 text-slate-600">{record.plate}</td>
                  <td className="py-3 px-4 text-slate-600">{record.type}</td>
                  <td className="py-3 px-4 text-slate-600">{record.date}</td>
                  <td className="py-3 px-4 text-slate-600">{record.inspector}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${record.status === 'passed' ? 'badge-success' : 'badge-danger'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-sm">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VehicleInspection
