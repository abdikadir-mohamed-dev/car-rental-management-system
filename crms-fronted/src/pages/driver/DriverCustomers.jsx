import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, Search, Phone, Mail, Star
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

const customers = [
  { name: 'Wanjiru Kamau', email: 'wanjiru.k@example.com', phone: '+254 711 222 333', trips: 12, rating: 4.9 },
  { name: 'Brian Otieno', email: 'brian.otieno@example.com', phone: '+254 722 333 444', trips: 8, rating: 4.7 },
  { name: 'Amina Yusuf', email: 'amina.yusuf@example.com', phone: '+254 733 444 555', trips: 21, rating: 5.0 },
  { name: 'Kevin Njoroge', email: 'kevin.n@example.com', phone: '+254 744 555 666', trips: 5, rating: 4.4 },
  { name: 'Grace Achieng', email: 'grace.a@example.com', phone: '+254 755 666 777', trips: 15, rating: 4.8 },
  { name: 'Samuel Kiptoo', email: 'samuel.k@example.com', phone: '+254 766 777 888', trips: 3, rating: 4.2 },
];

export default function DriverCustomersPage() {
  const [active, setActive] = React.useState('Customers');
  const [query, setQuery] = React.useState('');

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
              <p className="text-sm text-slate-500">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customers..."
                className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <div key={c.email} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {c.rating} · {c.trips} trips
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <p className="text-sm text-slate-600 flex items-center gap-2 truncate">
                    <Mail size={14} className="text-slate-400 flex-shrink-0" />
                    {c.email}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                    {c.phone}
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 bg-white rounded-xl shadow-sm p-10 text-center text-slate-400 text-sm">
                No customers match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}