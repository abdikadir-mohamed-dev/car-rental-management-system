import { useState } from 'react'
import toast from 'react-hot-toast'
import VehicleManagement from '../../components/admin/VehicleManagement'
import VehicleForm from '../../components/vehicles/VehicleForm'
import { createVehicle, updateVehicle } from '../../services/adminService'

function ManageVehiclesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, data)
        toast.success('Vehicle updated successfully')
      } else {
        await createVehicle(data)
        toast.success('Vehicle created successfully')
      }
      setShowForm(false)
      setEditingVehicle(null)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save vehicle')
    } finally {
      setSubmitting(false)
    }
  }

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
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => { setShowForm(false); setEditingVehicle(null) }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default ManageVehiclesPage
