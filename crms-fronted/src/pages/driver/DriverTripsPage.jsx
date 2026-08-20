import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, MapPin, Clock,
  Route, CheckCircle2, XCircle, ChevronRight
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

const trips = [
  {
    id: 'T-2295', customer: 'Wanjiru Kamau', vehicle: 'Toyota Prado — KDA 221B',
    pickup: 'JKIA Terminal 1', dropoff: 'Westlands Office', date: 'Aug 20, 2026',
    time: '09:30 AM', distance: '24 km', fare: '$32', status: 'Upcoming',
  },
  {
    id: 'T-2291', customer: 'Brian Otieno', vehicle: 'Subaru Forester — KDB 774K',
    pickup: 'Westlands Office', dropoff: 'Karen Branch', date: 'Aug 19, 2026',
    time: '02:00 PM', distance: '18 km', fare: '$26', status: 'In Progress',
  },
  {
    id: 'T-2285', customer: 'Amina Yusuf', vehicle: 'Mazda Demio — KCF 108T',
    pickup: 'Karen Branch', dropoff: 'Nairobi CBD', date: 'Aug 17, 2026',
    time: '11:00 AM', distance: '12 km', fare: '$18', status: 'Completed',
  },
  {
    id: 'T-2279', customer: 'Kevin Njoroge', vehicle: 'Toyota Prado — KDA 221B',
    pickup: 'Nairobi CBD', dropoff: 'JKIA Terminal 1', date: 'Aug 16, 2026',
    time: '06:45 PM', distance: '22 km', fare: '$40', status: 'Cancelled',
  },
  {
    id: 'T-2274', customer: 'Grace Achieng', vehicle: 'Honda Accord — KCE 552M',
    pickup: 'Kilimani', dropoff: 'Two Rivers Mall', date: 'Aug 15, 2026',
    time: '04:15 PM', distance: '15 km', fare: '$24', status: 'Completed',
  },
];

const tabs = ['All', 'Upcoming', 'In Progress', 'Completed', 'Cancelled'];

const statusStyle = {
  Upcoming: 'bg-blue-50 text-blue-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  Completed: 'bg-emerald-50 text-emerald-600',
  Cancelled: 'bg-rose-50 text-rose-600',
};

const statusIcon = {
  Upcoming: Clock,
  'In Progress': Route,
  Completed: CheckCircle2,
  Cancelled: XCircle,
};

export default function DriverTripsPage() {
  const [active, setActive] = React.useState('Trips');
  const [tab, setTab] = React.useState('All');
  const [expandedId, setExpandedId] = React.useState(null);

  const filtered = tab === 'All' ? trips : trips.filter((t) => t.status === tab);

  return (
    <div className="bg-slate-100 h-screen overflow-hidden flex">
      {/* Sidebar — anchored, scrolls independently */}
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
                  ${isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Topbar */}
        <nav className="bg-white flex items-center justify-end gap-2 px-6 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">James Driver</span>
          <ChevronDown size={16} className="text-slate-400" />
        </nav>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Trips</h1>
            <p className="text-sm text-slate-500">{filtered.length} trip{filtered.length !== 1 ? 's' : ''} {tab !== 'All' ? `· ${tab}` : ''}</p>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 border-b border-slate-200">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Trip cards */}
          <div className="space-y-3">
            {filtered.map((trip) => {
              const StatusIcon = statusIcon[trip.status];
              const isExpanded = expandedId === trip.id;
              return (
                <div key={trip.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : trip.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${statusStyle[trip.status]}`}>
                        <StatusIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{trip.customer}</p>
                        <p className="text-sm text-slate-500 truncate">{trip.vehicle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-sm text-slate-500 hidden sm:block">{trip.date} · {trip.time}</span>
                      <span className="font-semibold text-slate-800">{trip.fare}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[trip.status]}`}>
                        {trip.status}
                      </span>
                      <ChevronRight
                        size={18}
                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400">Pickup</p>
                          <p className="text-sm text-slate-700 font-medium">{trip.pickup}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400">Drop-off</p>
                          <p className="text-sm text-slate-700 font-medium">{trip.dropoff}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Route size={16} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400">Distance</p>
                          <p className="text-sm text-slate-700 font-medium">{trip.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock size={16} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400">Trip ID</p>
                          <p className="text-sm text-slate-700 font-medium">{trip.id}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center text-slate-400 text-sm">
                No trips in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}