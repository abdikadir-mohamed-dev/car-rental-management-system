import { MapPin, Clock, DollarSign } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Today's Trips</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Upcoming</p>
            <p className="text-2xl font-bold text-slate-900">2</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Earnings</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(450)}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Today's Assignments</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Pickup</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">09:00 AM</td>
                <td className="py-3 px-4 text-slate-600">John Doe</td>
                <td className="py-3 px-4 text-slate-600">Toyota Camry</td>
                <td className="py-3 px-4 text-slate-600">Downtown</td>
                <td className="py-3 px-4"><span className="badge badge-success">Completed</span></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">11:00 AM</td>
                <td className="py-3 px-4 text-slate-600">Jane Smith</td>
                <td className="py-3 px-4 text-slate-600">Honda CR-V</td>
                <td className="py-3 px-4 text-slate-600">Airport</td>
                <td className="py-3 px-4"><span className="badge badge-warning">Upcoming</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
