import DriverAssignments from '../../components/staff/DriverAssignments'

function StaffDriverAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Driver Assignments</h1>
          <p className="text-slate-600">Assign drivers to customer bookings that require a driver</p>
        </div>
      </div>
      <DriverAssignments />
    </div>
  )
}

export default StaffDriverAssignmentsPage
