import React from 'react'
import {
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, Download, TrendingUp, Clock, Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const reportData = {
  '7d': {
    metrics: [
      { label: 'Trips Completed', value: 15, icon: Route, bg: 'bg-blue-500' },
      { label: 'On-time Rate', value: '96%', icon: Clock, bg: 'bg-emerald-500' },
      { label: 'Avg Rating', value: '4.9', icon: Star, bg: 'bg-amber-500' },
      { label: 'Growth', value: '+8%', icon: TrendingUp, bg: 'bg-violet-500' },
    ],
  },
  '30d': {
    metrics: [
      { label: 'Trips Completed', value: 56, icon: Route, bg: 'bg-blue-500' },
      { label: 'On-time Rate', value: '94%', icon: Clock, bg: 'bg-emerald-500' },
      { label: 'Avg Rating', value: '4.8', icon: Star, bg: 'bg-amber-500' },
      { label: 'Growth', value: '+12%', icon: TrendingUp, bg: 'bg-violet-500' },
    ],
  },
  '90d': {
    metrics: [
      { label: 'Trips Completed', value: 178, icon: Route, bg: 'bg-blue-500' },
      { label: 'On-time Rate', value: '93%', icon: Clock, bg: 'bg-emerald-500' },
      { label: 'Avg Rating', value: '4.8', icon: Star, bg: 'bg-amber-500' },
      { label: 'Growth', value: '+19%', icon: TrendingUp, bg: 'bg-violet-500' },
    ],
  },
};

const periods = [
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
];

export default function DriverReportsPage() {
  const [active, setActive] = React.useState('Reports');
  const [period, setPeriod] = React.useState('30d');

  const data = reportData[period];

  const handleExport = () => {
    toast.success('Report exported successfully')
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500">Performance overview</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 text-sm font-medium shadow-sm">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                period === p.key ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
            {data.metrics.map(({ label, value, icon: Icon, bg }) => (
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
        </div>
  )
}