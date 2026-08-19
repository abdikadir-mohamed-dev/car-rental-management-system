import { useState, useEffect } from 'react'
import { getEarnings } from '../../services/driverService'
import { DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function Earnings() {
  const [earnings, setEarnings] = useState({
    total: 0,
    trips: [],
    period: 'this_month',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    getEarnings({ period: 'this_month' })
      .then((res) => setEarnings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
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
