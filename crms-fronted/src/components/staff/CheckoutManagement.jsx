import { useState } from 'react'
import { Search, CheckCircle, XCircle } from 'lucide-react'

const MOCK_BOOKINGS = [
  { _id: 'BKG-1024', customer: { name: 'Alice Mwangi' }, vehicle: { name: 'Toyota RAV4' }, pickupDate: '2026-08-20', dropoffDate: '2026-08-25', status: 'confirmed', pickupLocation: 'Nairobi CBD' },
  { _id: 'BKG-1023', customer: { name: 'Brian Otieno' }, vehicle: { name: 'Mazda CX-5' }, pickupDate: '2026-08-21', dropoffDate: '2026-08-28', status: 'confirmed', pickupLocation: 'Westlands' },
]

function CheckoutManagement() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [search, setSearch] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [mileage, setMileage] = useState('')
  const [fuelLevel, setFuelLevel] = useState('')
  const [condition, setCondition] = useState('')

  const filteredBookings = bookings.filter(b =>
    b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCheckout = (booking) => {
    setSelectedBooking(booking)
    setMileage('')
    setFuelLevel('')
    setCondition('')
  }

  const confirmCheckout = () => {
    setBookings(bookings.map(b => b._id === selectedBooking._id ? { ...b, status: 'active' } : b))
    setSelectedBooking(null)
  }

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
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
              <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Dates</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Location</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">#{booking._id}</td>
                <td className="py-3 px-4 text-slate-600">{booking.customer?.name || 'N/A'}</td>
                <td className="py-3 px-4 text-slate-600">{booking.vehicle?.name || 'N/A'}</td>
                <td className="py-3 px-4 text-slate-600">{booking.pickupDate} - {booking.dropoffDate}</td>
                <td className="py-3 px-4 text-slate-600">{booking.pickupLocation || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className="badge badge-success capitalize">{booking.status}</span>
                </td>
                <td className="py-3 px-4">
                  {booking.status === 'confirmed' && (
                    <button onClick={() => handleCheckout(booking)} className="btn-primary text-sm px-3 py-1">
                      Check-out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Check-out</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="font-medium text-slate-900">{selectedBooking.customer?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Vehicle</p>
                  <p className="font-medium text-slate-900">{selectedBooking.vehicle?.name || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="label">Starting Mileage (km)</label>
                <input
                  type="text"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="input"
                  placeholder="e.g. 45000"
                />
              </div>
              <div>
                <label className="label">Fuel Level</label>
                <select value={fuelLevel} onChange={(e) => setFuelLevel(e.target.value)} className="input">
                  <option value="">Select</option>
                  <option value="Full">Full</option>
                  <option value="3/4">3/4</option>
                  <option value="1/2">1/2</option>
                  <option value="1/4">1/4</option>
                  <option value="Empty">Empty</option>
                </select>
              </div>
              <div>
                <label className="label">Vehicle Condition</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="input"
                  placeholder="e.g. Good, minor scratch on bumper"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setSelectedBooking(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={confirmCheckout} className="btn-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Confirm Check-out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutManagement
