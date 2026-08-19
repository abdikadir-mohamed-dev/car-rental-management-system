import { CalendarCheck, Car, ClipboardList } from 'lucide-react'

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <CalendarCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Today's Pickups</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Today's Returns</p>
            <p className="text-2xl font-bold text-slate-900">8</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Pending Tasks</p>
            <p className="text-2xl font-bold text-slate-900">5</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Today's Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Time</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Action</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">09:00 AM</td>
                <td className="py-3 px-4 text-slate-600">John Doe</td>
                <td className="py-3 px-4 text-slate-600">Toyota Camry</td>
                <td className="py-3 px-4 text-slate-600">Check-out</td>
                <td className="py-3 px-4"><span className="badge badge-warning">Pending</span></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">10:30 AM</td>
                <td className="py-3 px-4 text-slate-600">Jane Smith</td>
                <td className="py-3 px-4 text-slate-600">Honda CR-V</td>
                <td className="py-3 px-4 text-slate-600">Check-in</td>
                <td className="py-3 px-4"><span className="badge badge-info">In Progress</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
