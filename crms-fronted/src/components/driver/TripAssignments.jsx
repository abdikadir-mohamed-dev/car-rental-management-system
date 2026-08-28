import { useState, useEffect } from 'react'
import { Check, X, MapPin, User, Car } from 'lucide-react'

const MOCK_TRIPS = [
  { _id: 'TRP-501', customer: { name: 'Alice Mwangi' }, vehicle: { name: 'Toyota RAV4' }, pickupLocation: 'Nairobi CBD', status: 'assigned' },
  { _id: 'TRP-502', customer: { name: 'Brian Otieno' }, vehicle: { name: 'Honda Accord' }, pickupLocation: 'Westlands', status: 'in_progress' },
  { _id: 'TRP-503', customer: { name: 'Grace Njeri' }, vehicle: { name: 'BMW 3 Series' }, pickupLocation: 'Kilimani', status: 'completed' },
  { _id: 'TRP-504', customer: { name: 'John Doe' }, vehicle: { name: 'Toyota Camry' }, pickupLocation: 'Karen', status: 'assigned' },
  { _id: 'TRP-505', customer: { name: 'Mary Wanjiku' }, vehicle: { name: 'Mazda CX-5' }, pickupLocation: 'JKIA', status: 'completed' },
]

function TripAssignments() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')

  useEffect(() => {
    setTimeout(() => {
      setTrips(MOCK_TRIPS)
      setLoading(false)
    }, 400)
  }, [])

  const filteredTrips = trips.filter(trip => {
    if (activeTab === 'upcoming') return trip.status === 'assigned'
    if (activeTab === 'active') return trip.status === 'in_progress'
    if (activeTab === 'completed') return trip.status === 'completed'
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {['upcoming', 'active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div key={trip._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-slate-900">{trip.customer?.name || 'Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Car className="w-4 h-4" />
                    <span>{trip.vehicle?.name || 'Vehicle'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.pickupLocation || 'Pickup location'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {trip.status === 'assigned' && (
                    <>
                      <button className="p-2 text-success hover:bg-emerald-50 rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-danger hover:bg-red-50 rounded-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredTrips.length === 0 && (
            <p className="text-center text-slate-500 py-8">No trips found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default TripAssignments
