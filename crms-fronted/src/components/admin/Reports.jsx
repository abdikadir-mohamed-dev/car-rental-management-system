import { BarChart3, Download } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function Reports() {
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
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">Revenue chart would be displayed here</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(45250)}</p>
          <p className="text-sm text-success mt-1">+12.5% from last month</p>
        </div>
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Total Bookings</h4>
          <p className="text-2xl font-bold text-slate-900">128</p>
          <p className="text-sm text-success mt-1">+8.2% from last month</p>
        </div>
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Avg. Booking Value</h4>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(353)}</p>
          <p className="text-sm text-success mt-1">+3.8% from last month</p>
        </div>
      </div>
    </div>
  )
}

export default Reports
