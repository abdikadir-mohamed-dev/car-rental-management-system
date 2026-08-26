import { useState } from 'react'
import { Search, UserCheck, UserX, Bell } from 'lucide-react'

const MOCK_DRIVER_REQUESTS = [
  { _id: 'DRQ-501', bookingId: 'BKG-1024', customer: { name: 'Alice Mwangi' }, vehicle: { name: 'Toyota RAV4' }, pickupDate: '2026-08-20', dropoffDate: '2026-08-25', pickupLocation: 'Nairobi CBD', dropoffLocation: 'JKIA', status: 'pending', requestedAt: '2026-08-18T10:30:00Z' },
  { _id: 'DRQ-502', bookingId: 'BKG-1023', customer: { name: 'Brian Otieno' }, vehicle: { name: 'Mazda CX-5' }, pickupDate: '2026-08-21', dropoffDate: '2026-08-28', pickupLocation: 'Westlands', dropoffLocation: 'Nairobi CBD', status: 'pending', requestedAt: '2026-08-19T14:00:00Z' },
]

const MOCK_AVAILABLE_DRIVERS = [
  { _id: 'DRV-201', name: 'James Kariuki', phone: '+254 711 111 111', licenseNumber: 'DL-D-001', experience: '5 years', rating: 4.8, status: 'available' },
  { _id: 'DRV-202', name: 'Peter Njoroge', phone: '+254 722 222 222', licenseNumber: 'DL-D-002', experience: '3 years', rating: 4.5, status: 'available' },
  { _id: 'DRV-203', name: 'Samuel Mwangi', phone: '+254 733 333 333', licenseNumber: 'DL-D-003', experience: '7 years', rating: 4.9, status: 'busy' },
]

function DriverAssignments() {
  const [requests, setRequests] = useState(MOCK_DRIVER_REQUESTS)
  const [drivers] = useState(MOCK_AVAILABLE_DRIVERS)
  const [search, setSearch] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedDriverId, setSelectedDriverId] = useState('')
  const [assignments, setAssignments] = useState([])

  const filteredRequests = requests.filter(r =>
    r.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicle?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r._id?.toLowerCase().includes(search.toLowerCase())
  )

  const availableDrivers = drivers.filter(d => d.status === 'available')

  const handleAssign = () => {
    if (!selectedRequest || !selectedDriverId) return
    const driver = drivers.find(d => d._id === selectedDriverId)
    const assignment = {
      _id: `ASN-${Date.now()}`,
      requestId: selectedRequest._id,
      bookingId: selectedRequest.bookingId,
      driver,
      customer: selectedRequest.customer,
      vehicle: selectedRequest.vehicle,
      pickupDate: selectedRequest.pickupDate,
      dropoffDate: selectedRequest.dropoffDate,
      pickupLocation: selectedRequest.pickupLocation,
      dropoffLocation: selectedRequest.dropoffLocation,
      status: 'assigned',
      assignedAt: new Date().toISOString(),
    }
    setAssignments([...assignments, assignment])
    setRequests(requests.filter(r => r._id !== selectedRequest._id))
    setSelectedRequest(null)
    setSelectedDriverId('')
  }

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-warning" />
          Pending Driver Requests
        </h3>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        {pendingRequests.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No pending driver requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Request ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">#{request._id}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{request.customer?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{request.vehicle?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{request.pickupDate} - {request.dropoffDate}</td>
                    <td className="py-3 px-4 text-slate-600">{request.pickupLocation} → {request.dropoffLocation}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => { setSelectedRequest(request); setSelectedDriverId(''); }}
                        className="btn-primary text-sm px-3 py-1 flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Assign Driver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {assignments.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-success" />
            Recent Assignments
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Assignment ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Driver</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">#{assignment._id}</td>
                    <td className="py-3 px-4 text-slate-600">{assignment.customer?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{assignment.driver?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{assignment.vehicle?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-success capitalize">{assignment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Confirm Driver Assignment</h3>
              <button onClick={() => { setSelectedRequest(null); setSelectedDriverId(''); }} className="text-slate-400 hover:text-slate-600">
                <UserX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-medium text-slate-900">{selectedRequest.customer?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="font-medium text-slate-900">{selectedRequest.vehicle?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup</p>
                  <p className="font-medium text-slate-900">{selectedRequest.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dropoff</p>
                  <p className="font-medium text-slate-900">{selectedRequest.dropoffLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pickup Date</p>
                  <p className="font-medium text-slate-900">{selectedRequest.pickupDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Return Date</p>
                  <p className="font-medium text-slate-900">{selectedRequest.dropoffDate}</p>
                </div>
              </div>
              <div>
                <label className="label">Select Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="input"
                >
                  <option value="">-- Choose a driver --</option>
                  {availableDrivers.map((driver) => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name} ({driver.licenseNumber}) - {driver.experience}
                    </option>
                  ))}
                </select>
                {availableDrivers.length === 0 && (
                  <p className="text-sm text-slate-500 mt-1">No available drivers at the moment.</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setSelectedRequest(null); setSelectedDriverId(''); }} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAssign} disabled={!selectedDriverId} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverAssignments
