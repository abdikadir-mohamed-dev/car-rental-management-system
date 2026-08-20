import React from 'react'
import {
  Car, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, Search, Fuel, Gauge
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const vehicles = [
  { plate: 'KDA 221B', model: 'Toyota Prado', mileage: 45210, fuel: 'Full', status: 'Available' },
  { plate: 'KDB 774K', model: 'Subaru Forester', mileage: 38900, fuel: '3/4', status: 'Rented' },
  { plate: 'KCF 108T', model: 'Mazda Demio', mileage: 30880, fuel: 'Half', status: 'Rented' },
  { plate: 'KCE 552M', model: 'Honda Accord', mileage: 52140, fuel: 'Full', status: 'Available' },
  { plate: 'KDC 340L', model: 'Nissan X-Trail', mileage: 18200, fuel: 'Low', status: 'Maintenance' },
  { plate: 'KDD 901R', model: 'Mercedes C-Class', mileage: 27650, fuel: '3/4', status: 'Unavailable' },
];

const tabs = ['All', 'Available', 'Rented', 'Maintenance', 'Unavailable'];

const statusStyle = {
  Available: 'bg-emerald-100 text-emerald-700',
  Rented: 'bg-blue-100 text-blue-700',
  Maintenance: 'bg-amber-100 text-amber-700',
  Unavailable: 'bg-rose-100 text-rose-700',
};

export default function DriverVehiclesPage() {
  const [tab, setTab] = React.useState('All');
  const [query, setQuery] = React.useState('');

  const filtered = vehicles.filter((v) => {
    const matchesTab = tab === 'All' || v.status === tab;
    const matchesQuery = v.model.toLowerCase().includes(query.toLowerCase()) || v.plate.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleVehicleAction = (vehicle, action) => {
    toast.success(`${vehicle.model} ${action}`)
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Vehicles</h1>
        <p className="text-sm text-slate-500">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} in fleet</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search model or plate..."
          className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <div key={v.plate} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Car size={20} className="text-slate-500" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[v.status]}`}>{v.status}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{v.model}</p>
                  <p className="text-sm text-slate-500">{v.plate}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5"><Gauge size={14} />{v.mileage.toLocaleString()} km</span>
                  <span className="flex items-center gap-1.5"><Fuel size={14} />{v.fuel}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="md:col-span-3 bg-white rounded-xl shadow-sm p-10 text-center text-slate-400 text-sm">
                No vehicles match your search.
              </div>
            )}
          </div>
        </div>
  )
}