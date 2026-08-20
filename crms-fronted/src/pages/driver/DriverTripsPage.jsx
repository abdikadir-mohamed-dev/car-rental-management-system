import TripAssignments from '../../components/driver/TripAssignments'

function DriverTripsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
      <TripAssignments />
    </div>
  )
}

export default DriverTripsPage
