import { useState } from 'react'
import VehicleManagement from '../../components/admin/VehicleManagement'
import VehicleForm from '../../components/vehicles/VehicleForm'

function ManageVehiclesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Vehicles</h1>
          <p className="text-slate-600 mt-1">View and manage your fleet</p>
        </div>
        <button onClick={() => { setEditingVehicle(null); setShowForm(true) }} className="btn-primary">Add Vehicle</button>
      </div>
      <VehicleManagement onEdit={(vehicle) => { setEditingVehicle(vehicle); setShowForm(true) }} />
      {showForm && <VehicleForm vehicle={editingVehicle} onClose={() => { setShowForm(false); setEditingVehicle(null) }} />}
    </div>
  )
}

export default ManageVehiclesPage
