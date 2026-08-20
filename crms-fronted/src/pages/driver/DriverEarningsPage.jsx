import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, TrendingUp, Wallet,
  Download, Route
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

const earningsByPeriod = {
  week: {
    total: 'KSH 420',
    trips: 15,
    avg: 'KSH 28',
    pending: 'KSH 60',
    chart: [
      { label: 'Mon', amount: 60 },
      { label: 'Tue', amount: 45 },
      { label: 'Wed', amount: 80 },
      { label: 'Thu', amount: 55 },
      { label: 'Fri', amount: 90 },
      { label: 'Sat', amount: 70 },
      { label: 'Sun', amount: 20 },
    ],
  },
  month: {
    total: 'KSH 1,680',
    trips: 56,
    avg: 'KSH 30',
    pending: 'KSH 180',
    chart: [
      { label: 'Wk 1', amount: 380 },
      { label: 'Wk 2', amount: 420 },
      { label: 'Wk 3', amount: 460 },
      { label: 'Wk 4', amount: 420 },
    ],
  },
  year: {
    total: 'KSH 19,240',
    trips: 642,
    avg: 'KSH 30',
    pending: 'KSH 180',
    chart: [
      { label: 'Q1', amount: 4200 },
      { label: 'Q2', amount: 4800 },
      { label: 'Q3', amount: 5100 },
      { label: 'Q4', amount: 5140 },
    ],
  },
};

const recentTrips = [
  { id: 'T-2291', date: 'Aug 19', customer: 'Wanjiru Kamau', vehicle: 'Toyota Prado', amount: 'KSH 32', status: 'Paid' },
  { id: 'T-2288', date: 'Aug 19', customer: 'Brian Otieno', vehicle: 'Subaru Forester', amount: 'KSH 26', status: 'Paid' },
  { id: 'T-2285', date: 'Aug 18', customer: 'Amina Yusuf', vehicle: 'Mazda Demio', amount: 'KSH 18', status: 'Paid' },
  { id: 'T-2279', date: 'Aug 18', customer: 'Kevin Njoroge', vehicle: 'Toyota Prado', amount: 'KSH 40', status: 'Pending' },
  { id: 'T-2274', date: 'Aug 17', customer: 'Grace Achieng', vehicle: 'Honda Accord', amount: 'KSH 24', status: 'Paid' },
];

const statusStyle = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
};

export default function DriverEarningsPage() {
  const [active, setActive] = React.useState('Earnings');
  const [period, setPeriod] = React.useState('week');

  const data = earningsByPeriod[period];

  const handleExport = () => {
    toast.success('Earnings report exported')
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Earnings</h1>
        <p className="text-sm text-slate-500">Track your trip income and payouts</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 text-sm font-medium shadow-sm">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                period === p ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Summary cards */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Total Earnings', value: data.total, icon: DollarSign, bg: 'bg-emerald-500' },
              { label: 'Trips Completed', value: data.trips, icon: Route, bg: 'bg-blue-500' },
              { label: 'Avg per Trip', value: data.avg, icon: TrendingUp, bg: 'bg-violet-500' },
              { label: 'Pending Payout', value: data.pending, icon: Wallet, bg: 'bg-amber-500' },
            ].map(({ label, value, icon: Icon, bg }) => (
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

          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Earnings Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent trips table */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Recent Trip Earnings</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">Trip ID</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 text-slate-600">{t.id}</td>
                    <td className="py-3 text-slate-600">{t.date}</td>
                    <td className="py-3 text-slate-800 font-medium">{t.customer}</td>
                    <td className="py-3 text-slate-600">{t.vehicle}</td>
                    <td className="py-3 text-slate-800 font-semibold">{t.amount}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  )
}