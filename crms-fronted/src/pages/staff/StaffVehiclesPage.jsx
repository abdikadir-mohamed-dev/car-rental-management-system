import VehicleInspection from '../../components/staff/VehicleInspection'

function StaffVehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Vehicle Inspection</h1>
      </div>
      <VehicleInspection />
    </div>
  )
}

export default StaffVehiclesPage
