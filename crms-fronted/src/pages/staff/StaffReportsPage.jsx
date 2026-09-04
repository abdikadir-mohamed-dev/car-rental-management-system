import { useEffect, useState } from 'react'
import { Search, Download } from 'lucide-react'
import axios from 'axios'
import { setAuthToken } from '../../services/authService'
import { VITE_API_URL } from '../../utils/constants'

const API_URL = VITE_API_URL

const reportService = axios.create({
  baseURL: `${API_URL}/api/reports`,
  headers: {
    'Content-Type': 'application/json',
  },
})

setAuthToken(localStorage.getItem('token'), reportService)

function StaffReports() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ==========================================================
  // LOAD REPORTS
  // ==========================================================

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await reportService.get('/')

        // Backend may return:
        // - an array directly
        // - { reports: [...] }
        // - { data: [...] }
        const data = response.data

        if (Array.isArray(data)) {
          setReports(data)
        } else if (Array.isArray(data?.reports)) {
          setReports(data.reports)
        } else if (Array.isArray(data?.data)) {
          setReports(data.data)
        } else {
          setReports([])
        }
      } catch (err) {
        console.error('Failed to load reports:', err)

        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to load reports'
        )

        setReports([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filtered = reports.filter((report) =>
    report.title?.toLowerCase().includes(search.toLowerCase()) ||
    report.type?.toLowerCase().includes(search.toLowerCase())
  )

  // ==========================================================
  // DOWNLOAD REPORT
  // ==========================================================

  const handleDownload = (report) => {
    const content = JSON.stringify(
      report.data || report,
      null,
      2
    )

    const blob = new Blob(
      [content],
      { type: 'application/json' }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = `${report._id || report.id}-${report.title || 'report'}.json`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">
          Loading reports...
        </p>
      </div>
    )
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="text-slate-600">
            View and download operational reports
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* SEARCH */}

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

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200">

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                ID
              </th>

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                Title
              </th>

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                Type
              </th>

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                Date
              </th>

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                Status
              </th>

              <th className="text-left py-3 px-4 font-medium text-slate-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((report) => (

              <tr
                key={report.id || report._id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >

                <td className="py-3 px-4 text-slate-900">
                  #{report._id || report.id || 'N/A'}
                </td>

                <td className="py-3 px-4 text-slate-600 font-medium">
                  {report.title || 'Untitled Report'}
                </td>

                <td className="py-3 px-4 text-slate-600">
                  {report.type || 'N/A'}
                </td>

                <td className="py-3 px-4 text-slate-600">
                  {report.date || report.created_at || 'N/A'}
                </td>

                <td className="py-3 px-4">

                  <span
                    className={`badge ${
                      report.status === 'ready'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {report.status || 'pending'}
                  </span>

                </td>

                <td className="py-3 px-4">

                  {report.status === 'ready' && (

                    <button
                      onClick={() => handleDownload(report)}
                      className="btn-secondary text-sm px-3 py-1 flex items-center gap-2"
                    >

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

          <p className="text-center text-slate-500 py-8">
            No reports found.
          </p>

        )}

      </div>

    </div>
  )
}

export default StaffReports