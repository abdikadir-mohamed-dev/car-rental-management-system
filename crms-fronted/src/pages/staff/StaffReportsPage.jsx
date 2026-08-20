import { useState } from 'react'
import { Search, Download, BarChart3 } from 'lucide-react'

const MOCK_REPORTS = [
  { _id: 'RPT-101', title: 'Monthly Revenue', type: 'Revenue', date: '2026-08-01', status: 'ready' },
  { _id: 'RPT-102', title: 'Booking Summary', type: 'Bookings', date: '2026-08-01', status: 'ready' },
  { _id: 'RPT-103', title: 'Fleet Utilization', type: 'Fleet', date: '2026-07-01', status: 'ready' },
  { _id: 'RPT-104', title: 'Most Rented Vehicles', type: 'Fleet', date: '2026-07-01', status: 'processing' },
]

function StaffReports() {
  const [reports] = useState(MOCK_REPORTS)
  const [search, setSearch] = useState('')

  const filtered = reports.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.type?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">View and download operational reports</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Title</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Type</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Date</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">#{report._id}</td>
                <td className="py-3 px-4 text-slate-600 font-medium">{report.title}</td>
                <td className="py-3 px-4 text-slate-600">{report.type}</td>
                <td className="py-3 px-4 text-slate-600">{report.date}</td>
                <td className="py-3 px-4">
                  <span className={`badge ${report.status === 'ready' ? 'badge-success' : 'badge-warning'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {report.status === 'ready' && (
                    <button className="btn-secondary text-sm px-3 py-1 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-8">No reports found.</p>
        )}
      </div>
    </div>
  )
}

export default StaffReports
