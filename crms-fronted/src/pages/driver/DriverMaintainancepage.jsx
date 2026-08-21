import React from 'react'
import {
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, Plus, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialRequests = [
  { id: 'M-301', vehicle: 'Nissan X-Trail — KDC 340L', issue: 'Brake pads worn', priority: 'High', status: 'In Progress', date: 'Aug 18' },
  { id: 'M-298', vehicle: 'Toyota Prado — KDA 221B', issue: 'AC not cooling', priority: 'Medium', status: 'Open', date: 'Aug 17' },
  { id: 'M-291', vehicle: 'Honda Accord — KCE 552M', issue: 'Routine service', priority: 'Low', status: 'Resolved', date: 'Aug 12' },
];

const priorityStyle = {
  High: 'badge-danger',
  Medium: 'badge-warning',
  Low: 'badge-info',
};

const statusStyle = {
  Open: 'badge-info',
  'In Progress': 'badge-warning',
  Resolved: 'badge-success',
};

export default function DriverMaintenancePage() {
  const [active, setActive] = React.useState('Maintenance');
  const [requests, setRequests] = React.useState(initialRequests);
  const [showForm, setShowForm] = React.useState(false);
  const [vehicle, setVehicle] = React.useState('');
  const [issue, setIssue] = React.useState('');
  const [priority, setPriority] = React.useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `M-${300 + requests.length + 1}`,
      vehicle,
      issue,
      priority,
      status: 'Open',
      date: 'Today',
    };
    setRequests([newRequest, ...requests]);
    setVehicle('');
    setIssue('');
    setPriority('Medium');
    setShowForm(false);
    toast.success('Maintenance request submitted')
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance</h1>
          <p className="text-sm text-slate-500">{requests.length} request{requests.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 text-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Request'}
        </button>
      </div>

      {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <h2 className="text-base font-semibold text-slate-800">Log a Maintenance Issue</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Toyota Prado — KDA 221B"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {['Low', 'Medium', 'High'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Issue Description</label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Submit Request
              </button>
            </form>
          )}

          <div className="bg-white rounded-xl shadow-sm p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium">Issue</th>
                  <th className="pb-2 font-medium">Priority</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 text-slate-600">{r.id}</td>
                    <td className="py-3 text-slate-800 font-medium">{r.vehicle}</td>
                    <td className="py-3 text-slate-600">{r.issue}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyle[r.priority]}`}>{r.priority}</span>
                    </td>
                    <td className="py-3 text-slate-600">{r.date}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[r.status]}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  )
}