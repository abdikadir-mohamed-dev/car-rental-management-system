import { useState } from 'react'
import { Search, CheckCircle, XCircle } from 'lucide-react'

const MOCK_BOOKINGS = [
  { _id: 'BKG-1024', customer: 'Alice Mwangi', vehicle: 'Toyota RAV4', pickupDate: '2026-08-20', dropoffDate: '2026-08-25', status: 'confirmed', pickupLocation: 'Nairobi CBD' },
  { _id: 'BKG-1023', customer: 'Brian Otieno', vehicle: 'Mazda CX-5', pickupDate: '2026-08-21', dropoffDate: '2026-08-28', status: 'confirmed', pickupLocation: 'Westlands' },
]

function DriverCheckoutPage() {
  const [bookings] = useState(MOCK_BOOKINGS)
  const [search, setSearch] = useState('')

  const filtered = bookings.filter(b =>
    b.customer?.toLowerCase().includes(search.toLowerCase()) ||
    b.vehicle?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Check-out</h1>
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
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">#{booking._id}</td>
                <td className="py-3 px-4 text-slate-600">{booking.customer}</td>
                <td className="py-3 px-4 text-slate-600">{booking.vehicle}</td>
                <td className="py-3 px-4 text-slate-600">{booking.pickupDate} - {booking.dropoffDate}</td>
                <td className="py-3 px-4 text-slate-600">{booking.pickupLocation}</td>
                <td className="py-3 px-4">
                  <span className="badge badge-success capitalize">{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DriverCheckoutPage
