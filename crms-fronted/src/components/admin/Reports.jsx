import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { getReports } from '../../services/adminService'

function Reports() {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getReports()
        setReports(data)
      } catch (err) {
        setError(err.message || 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 hover:underline">Retry</button>
      </div>
    )
  }

  const revenue = reports?.revenue || { labels: [], values: [] }
  const bookings = reports?.bookings || { labels: [], values: [] }
  const fleet = reports?.fleetUtilization || {}

  const maxRevenue = Math.max(...(revenue.values || [1]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
          <p className="text-sm text-slate-600">Track your revenue over time</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      <div className="card p-6">
        <div className="h-64 flex items-end gap-2">
          {(revenue.labels || []).map((item, index) => {
            const amount = revenue.values[index] || 0
            const height = maxRevenue > 0 ? (amount / maxRevenue) * 100 : 0
            return (
              <div key={item} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-slate-600">KES {(amount || 0).toLocaleString()}</span>
                <div className="w-full bg-primary/10 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500 hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{item}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-slate-900">
            KES {(revenue.values || []).reduce((a, b) => a + b, 0).toLocaleString()}
          </p>
          <p className="text-sm text-success mt-1">+12.5% from last period</p>
        </div>
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Total Bookings</h4>
          <p className="text-2xl font-bold text-slate-900">
            {(bookings.values || []).reduce((a, b) => a + b, 0).toLocaleString()}
          </p>
          <p className="text-sm text-success mt-1">+8.2% from last period</p>
        </div>
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Fleet Utilization</h4>
          <p className="text-2xl font-bold text-slate-900">{fleet.utilizationRate || 0}%</p>
          <p className="text-sm text-slate-600 mt-1">
            {fleet.rented || 0} rented / {fleet.available || 0} available
          </p>
        </div>
      </div>
    </div>
  )
}

export default Reports
