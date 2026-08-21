import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

const MOCK_EARNINGS = {
  total: 12450,
  trips: [
    { _id: 'TRP-501', date: '2026-08-20', customer: { name: 'Alice Mwangi' }, vehicle: { name: 'Toyota RAV4' }, earnings: 3200 },
    { _id: 'TRP-502', date: '2026-08-19', customer: { name: 'Brian Otieno' }, vehicle: { name: 'Honda Accord' }, earnings: 2800 },
    { _id: 'TRP-503', date: '2026-08-18', customer: { name: 'Grace Njeri' }, vehicle: { name: 'BMW 3 Series' }, earnings: 3500 },
    { _id: 'TRP-504', date: '2026-08-17', customer: { name: 'John Doe' }, vehicle: { name: 'Toyota Camry' }, earnings: 2950 },
    { _id: 'TRP-505', date: '2026-08-16', customer: { name: 'Mary Wanjiku' }, vehicle: { name: 'Mazda CX-5' }, earnings: 2100 },
  ],
}

function Earnings() {
  const [earnings, setEarnings] = useState(MOCK_EARNINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 400)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Earnings</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(earnings.total || 0)}</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Trips Completed</p>
            <p className="text-2xl font-bold text-slate-900">{earnings.trips?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Completed Trips</h3>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {earnings.trips?.map((trip) => (
                  <tr key={trip._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{trip.date || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{trip.customer?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600">{trip.vehicle?.name || 'N/A'}</td>
                    <td className="py-3 px-4 font-medium text-success">{formatCurrency(trip.earnings || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!earnings.trips || earnings.trips.length === 0) && (
              <p className="text-center text-slate-500 py-8">No completed trips yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Earnings
