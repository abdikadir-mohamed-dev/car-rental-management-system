import { CalendarCheck, Car, ClipboardList, Activity } from 'lucide-react'

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Active Rentals</p>
            <p className="text-2xl font-bold text-slate-900">24</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
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

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Vehicle Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Available</span>
              <span className="text-sm font-medium text-slate-900">18</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Rented</span>
              <span className="text-sm font-medium text-slate-900">24</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Maintenance</span>
              <span className="text-sm font-medium text-slate-900">3</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Dates</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">#BKG-1024</td>
                <td className="py-3 px-4 text-slate-600">Alice Mwangi</td>
                <td className="py-3 px-4 text-slate-600">Toyota RAV4</td>
                <td className="py-3 px-4 text-slate-600">Aug 20 - Aug 25</td>
                <td className="py-3 px-4"><span className="badge badge-success">Confirmed</span></td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">#BKG-1023</td>
                <td className="py-3 px-4 text-slate-600">Brian Otieno</td>
                <td className="py-3 px-4 text-slate-600">Mazda CX-5</td>
                <td className="py-3 px-4 text-slate-600">Aug 21 - Aug 28</td>
                <td className="py-3 px-4"><span className="badge badge-warning">Pending</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900">#BKG-1022</td>
                <td className="py-3 px-4 text-slate-600">Grace Njeri</td>
                <td className="py-3 px-4 text-slate-600">Nissan X-Trail</td>
                <td className="py-3 px-4 text-slate-600">Aug 19 - Aug 22</td>
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
