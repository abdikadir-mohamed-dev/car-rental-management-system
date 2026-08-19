import { useState, useEffect } from 'react'
import { getTrips, updateTripStatus } from '../../services/staffService'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

function TripManagement() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadTrips = () => {
    setLoading(true)
    getTrips({})
      .then((res) => setTrips(res.data.trips || res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTrips()
  }, [])

  const handleStatusUpdate = (id, status) => {
    updateTripStatus(id, status)
      .then(() => {
        toast.success('Trip status updated')
        loadTrips()
      })
      .catch(() => toast.error('Failed to update status'))
  }

  const filteredTrips = trips.filter(trip =>
    trip.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    trip.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search trips..."
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
                <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Pickup</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => (
                <tr key={trip._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">{trip.customer?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-600">{trip.vehicle?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-600">{trip.pickupLocation || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge capitalize ${trip.status === 'in_progress' ? 'badge-info' : trip.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {trip.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {trip.status === 'assigned' && (
                      <button onClick={() => handleStatusUpdate(trip._id, 'in_progress')} className="btn-primary text-sm px-3 py-1">
                        Start
                      </button>
                    )}
                    {trip.status === 'in_progress' && (
                      <button onClick={() => handleStatusUpdate(trip._id, 'completed')} className="btn-success text-sm px-3 py-1">
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrips.length === 0 && (
            <p className="text-center text-slate-500 py-8">No trips found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default TripManagement
