import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, MapPin, Clock,
  Route, CheckCircle2, XCircle, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const trips = [
  {
    id: 'T-2295', customer: 'Wanjiru Kamau', vehicle: 'Toyota Prado — KDA 221B',
    pickup: 'JKIA Terminal 1', dropoff: 'Westlands Office', date: 'Aug 20, 2026',
    time: '09:30 AM', distance: '24 km', fare: 'KSH 32', status: 'Upcoming',
  },
  {
    id: 'T-2291', customer: 'Brian Otieno', vehicle: 'Subaru Forester — KDB 774K',
    pickup: 'Westlands Office', dropoff: 'Karen Branch', date: 'Aug 19, 2026',
    time: '02:00 PM', distance: '18 km', fare: 'KSH 26', status: 'In Progress',
  },
  {
    id: 'T-2285', customer: 'Amina Yusuf', vehicle: 'Mazda Demio — KCF 108T',
    pickup: 'Karen Branch', dropoff: 'Nairobi CBD', date: 'Aug 17, 2026',
    time: '11:00 AM', distance: '12 km', fare: 'KSH 18', status: 'Completed',
  },
  {
    id: 'T-2279', customer: 'Kevin Njoroge', vehicle: 'Toyota Prado — KDA 221B',
    pickup: 'Nairobi CBD', dropoff: 'JKIA Terminal 1', date: 'Aug 16, 2026',
    time: '06:45 PM', distance: '22 km', fare: 'KSH 40', status: 'Cancelled',
  },
  {
    id: 'T-2274', customer: 'Grace Achieng', vehicle: 'Honda Accord — KCE 552M',
    pickup: 'Kilimani', dropoff: 'Two Rivers Mall', date: 'Aug 15, 2026',
    time: '04:15 PM', distance: '15 km', fare: 'KSH 24', status: 'Completed',
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

  const handleTripAction = (trip, action) => {
    toast.success(`Trip ${trip.id} ${action}`)
  }

  const filtered = tab === 'All' ? trips : trips.filter((t) => t.status === tab);

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
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
  );
}