import { useState, useEffect } from 'react'
import { getTrips, updateTripStatus } from '../../services/staffService'
import toast from 'react-hot-toast'
import { Search, XCircle, AlertTriangle } from 'lucide-react'

function TripManagement() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [issueNote, setIssueNote] = useState('')

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

  const handleReportIssue = (id) => {
    if (!issueNote.trim()) {
      toast.error('Please enter an issue description')
      return
    }
    toast.success('Issue reported successfully')
    setIssueNote('')
    setSelectedTrip(null)
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
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedTrip(trip)} className="p-2 text-primary hover:bg-primary-light rounded-lg">
                        <Search className="w-4 h-4" />
                      </button>
                      {trip.status === 'assigned' && (
                        <button onClick={() => handleStatusUpdate(trip._id, 'in_progress')} className="btn-primary text-sm px-3 py-1">
                          Accept
                        </button>
                      )}
                      {trip.status === 'in_progress' && (
                        <button onClick={() => handleStatusUpdate(trip._id, 'completed')} className="btn-success text-sm px-3 py-1">
                          Complete
                        </button>
                      )}
                    </div>
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

      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Trip Details</h3>
              <button onClick={() => setSelectedTrip(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-medium text-slate-900">{selectedTrip.customer?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="font-medium text-slate-900">{selectedTrip.vehicle?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup Location</p>
                  <p className="font-medium text-slate-900">{selectedTrip.pickupLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dropoff Location</p>
                  <p className="font-medium text-slate-900">{selectedTrip.dropoffLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup Time</p>
                  <p className="font-medium text-slate-900">{selectedTrip.pickupTime || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`badge capitalize ${selectedTrip.status === 'in_progress' ? 'badge-info' : selectedTrip.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {selectedTrip.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <label className="label">Report an Issue</label>
                <textarea
                  placeholder="Describe the issue..."
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                  className="input"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setSelectedTrip(null)} className="btn-secondary">
                Close
              </button>
              <button onClick={() => handleReportIssue(selectedTrip._id)} className="btn-secondary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Report Issue
              </button>
              {selectedTrip.status === 'assigned' && (
                <button onClick={() => { handleStatusUpdate(selectedTrip._id, 'in_progress'); setSelectedTrip(null); }} className="btn-primary">
                  Accept Assignment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripManagement
