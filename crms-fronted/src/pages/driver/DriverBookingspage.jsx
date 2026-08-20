import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, Search, MapPin
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'My Assignments', icon: ClipboardList },
  { label: 'Trips', icon: Route },
  { label: 'Earnings', icon: DollarSign },
  { label: 'Bookings', icon: Calendar },
  { label: 'Check-out', icon: LogOut },
  { label: 'Check-in', icon: LogIn },
  { label: 'Vehicles', icon: Car },
  { label: 'Customers', icon: Users },
  { label: 'Maintenance', icon: Wrench },
  { label: 'Reports', icon: BarChart2 },
  { label: 'Notifications', icon: Bell },
  { label: 'Profile', icon: User },
  { label: 'Logout', icon: Power },
];

const bookings = [
  { id: '#BK001', customer: 'John Doe', vehicle: 'Toyota RAV4', pickup: 'Nairobi CBD', date: '20 Aug', amount: '$300', status: 'Confirmed' },
  { id: '#BK002', customer: 'Mary Wanjiku', vehicle: 'Honda Accord', pickup: 'JKIA Airport', date: '21 Aug', amount: '$280', status: 'Confirmed' },
  { id: '#BK003', customer: 'Peter Mwangi', vehicle: 'BMW 3 Series', pickup: 'Westlands', date: '22 Aug', amount: '$350', status: 'Pending' },
  { id: '#BK004', customer: 'Ali Hassan', vehicle: 'Mercedes C-Class', pickup: 'Karen', date: '23 Aug', amount: '$420', status: 'Pending' },
  { id: '#BK005', customer: 'Grace Achieng', vehicle: 'Toyota Prado', pickup: 'Kilimani', date: '18 Aug', amount: '$310', status: 'Completed' },
  { id: '#BK006', customer: 'Kevin Njoroge', vehicle: 'Subaru Forester', pickup: 'Sarit Centre', date: '16 Aug', amount: '$260', status: 'Cancelled' },
];

const tabs = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

const statusStyle = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

export default function DriverBookingsPage() {
  const [active, setActive] = React.useState('Bookings');
  const [tab, setTab] = React.useState('All');
  const [query, setQuery] = React.useState('');

  const filtered = bookings.filter((b) => {
    const matchesTab = tab === 'All' || b.status === tab;
    const matchesQuery =
      b.customer.toLowerCase().includes(query.toLowerCase()) ||
      b.id.toLowerCase().includes(query.toLowerCase()) ||
      b.vehicle.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="bg-slate-100 h-screen overflow-hidden flex">
      <div className="bg-[#0D1B2A] w-56 h-screen overflow-y-auto text-slate-400 flex-shrink-0">
        <div className="flex items-center gap-2 text-xl font-bold text-white py-6 px-5">
          <ShipWheel size={22} className="text-blue-500" />
          DriveGo
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                  ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <nav className="bg-white flex items-center justify-end gap-2 px-6 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">James Driver</span>
          <ChevronDown size={16} className="text-slate-400" />
        </nav>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
              <p className="text-sm text-slate-500">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookings..."
                className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-2 border-b border-slate-200">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Booking ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium">Pickup</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 text-slate-600">{b.id}</td>
                    <td className="py-3 text-slate-800 font-medium">{b.customer}</td>
                    <td className="py-3 text-slate-600">{b.vehicle}</td>
                    <td className="py-3 text-slate-600 flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" />{b.pickup}</td>
                    <td className="py-3 text-slate-600">{b.date}</td>
                    <td className="py-3 text-slate-800 font-semibold">{b.amount}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[b.status]}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">No bookings match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}