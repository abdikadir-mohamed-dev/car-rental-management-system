import { BarChart3, Download } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Jan', amount: 3200 },
  { month: 'Feb', amount: 4100 },
  { month: 'Mar', amount: 3800 },
  { month: 'Apr', amount: 5200 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 6100 },
  { month: 'Jul', amount: 5700 },
  { month: 'Aug', amount: 6300 },
  { month: 'Sep', amount: 5900 },
  { month: 'Oct', amount: 7100 },
  { month: 'Nov', amount: 6800 },
  { month: 'Dec', amount: 7500 },
]

const maxAmount = Math.max(...monthlyRevenue.map(m => m.amount))

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
        <div className="h-64 flex items-end gap-2">
          {monthlyRevenue.map((item) => {
            const height = (item.amount / maxAmount) * 100
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-slate-600">KES {item.amount.toLocaleString()}</span>
                <div className="w-full bg-primary/10 rounded-t-lg relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500 hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{item.month}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-slate-900">KES 45,250</p>
          <p className="text-sm text-success mt-1">+12.5% from last month</p>
        </div>
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Total Bookings</h4>
          <p className="text-2xl font-bold text-slate-900">128</p>
          <p className="text-sm text-success mt-1">+8.2% from last month</p>
        </div>
        <div className="card p-6">
          <h4 className="font-medium text-slate-600 mb-2">Avg. Booking Value</h4>
          <p className="text-2xl font-bold text-slate-900">KES 353</p>
          <p className="text-sm text-success mt-1">+3.8% from last month</p>
        </div>
      </div>
    </div>
  )
}

export default Reports
