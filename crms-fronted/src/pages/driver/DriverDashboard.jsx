import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, CheckCircle, DollarSign, ChevronDown, ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-hot-toast';

const statCards = [
  { label: "Today's Trips", value: 3, icon: ClipboardList, bg: 'bg-blue-500' },
  { label: 'Upcoming', value: 1, icon: Calendar, bg: 'bg-emerald-500' },
  { label: 'Completed', value: 2, icon: CheckCircle, bg: 'bg-violet-500' },
  { label: 'Total Earnings', value: 'KSH 120', icon: DollarSign, bg: 'bg-amber-500' },
];

const assignments = [
  { time: '09:00 AM', customer: 'John Doe', vehicle: 'Toyota RAV4', pickup: 'Nairobi CBD', status: 'Assigned' },
  { time: '02:00 PM', customer: 'Mary Wanjiku', vehicle: 'Honda Accord', pickup: 'JKIA Airport', status: 'Upcoming' },
  { time: '05:00 PM', customer: 'Peter Mwangi', vehicle: 'BMW 3 Series', pickup: 'Westlands', status: 'Assigned' },
];

const statusStyle = {
  Assigned: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
};

const vehicleData = [
  { name: 'Available', value: 16, color: '#3b82f6' },
  { name: 'Rented', value: 8, color: '#22c55e' },
  { name: 'Maintenance', value: 4, color: '#f59e0b' },
  { name: 'Unavailable', value: 2, color: '#ef4444' },
];
const totalVehicles = vehicleData.reduce((sum, v) => sum + v.value, 0);

const bookings = [
  { id: '#BK001', customer: 'John Doe', vehicle: 'Toyota RAV4', date: '20 May', amount: 'KSH 300', status: 'Confirmed' },
  { id: '#BK002', customer: 'Mary Wanjiku', vehicle: 'Honda Accord', date: '21 May', amount: 'KSH 280', status: 'Confirmed' },
  { id: '#BK003', customer: 'Peter Mwangi', vehicle: 'BMW 3 Series', date: '22 May', amount: 'KSH 350', status: 'Confirmed' },
  { id: '#BK004', customer: 'Ali Hassan', vehicle: 'Mercedes C-Class', date: '23 May', amount: 'KSH 420', status: 'Pending' },
];

export default function App() {
  const [active, setActive] = React.useState('Dashboard');
  const [earningsView, setEarningsView] = React.useState('week');

  const handleCompleteTrip = () => {
    toast.success('Trip completed successfully')
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-slate-800">Driver Dashboard</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-6">
            {statCards.map(({ label, value, icon: Icon, bg }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
                <div className={`${bg} w-11 h-11 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-xl font-bold text-slate-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Assignments + Vehicle status */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Today's Assignments</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Vehicle</th>
                    <th className="pb-2 font-medium">Pickup Location</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((row) => (
                    <tr key={row.time} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 text-slate-600">{row.time}</td>
                      <td className="py-3 text-slate-800 font-medium">{row.customer}</td>
                      <td className="py-3 text-slate-600">{row.vehicle}</td>
                      <td className="py-3 text-slate-600">{row.pickup}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="mt-4 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
                View All Assignments <ArrowRight size={14} />
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Vehicle Status</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <PieChart width={128} height={128}>
                    <Pie
                      data={vehicleData}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={62}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {vehicleData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold text-slate-800">{totalVehicles}</span>
                    <span className="text-[10px] text-slate-400">Total Vehicles</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  {vehicleData.map((v) => (
                    <div key={v.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                      <span className="text-slate-600 w-24">{v.name}</span>
                      <span className="text-slate-800 font-semibold">{v.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current trip + Earnings + Bookings */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800">Current Trip</h2>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Trip in Progress
                </span>
              </div>
              <dl className="space-y-2.5 text-sm">
                {[
                  ['Customer', 'John Doe'],
                  ['Vehicle', 'Toyota RAV4'],
                  ['Pickup', 'Nairobi CBD'],
                  ['Drop-off', 'Nairobi CBD'],
                  ['Started At', '09:15 AM'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-slate-400">{k}</dt>
                    <dd className="text-slate-700 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
               <button onClick={handleCompleteTrip} className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                 Complete Trip
               </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800">Earnings Overview</h2>
                <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-medium">
                  <button
                    onClick={() => setEarningsView('week')}
                    className={`px-2.5 py-1 rounded-md ${earningsView === 'week' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setEarningsView('month')}
                    className={`px-2.5 py-1 rounded-md ${earningsView === 'month' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                  >
                    This Month
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">{earningsView === 'week' ? 'This Week' : 'This Month'}</p>
                   <p className="text-2xl font-bold text-slate-800">{earningsView === 'week' ? 'KSH 120' : 'KSH 480'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Total Trips</p>
                  <p className="text-2xl font-bold text-slate-800">{earningsView === 'week' ? 15 : 56}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800">Recent Bookings</h2>
                <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <p className="text-slate-800 font-medium truncate">{b.customer}</p>
                      <p className="text-xs text-slate-400 truncate">{b.vehicle} · {b.date}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-700 font-medium">{b.amount}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  )
}