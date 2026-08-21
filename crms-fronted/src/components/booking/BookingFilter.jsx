import { useState } from 'react'
import { BOOKING_STATUS } from '../../utils/constants'

function BookingFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  })

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = { status: '', startDate: '', endDate: '' }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900 mb-4">Filters</h3>
      <div className="space-y-4">
        <div>
          <label className="label">Status</label>
          <select name="status" value={filters.status} onChange={handleChange} className="input capitalize">
            <option value="">All Statuses</option>
            {Object.values(BOOKING_STATUS).map((status) => (
              <option key={status} value={status} className="capitalize">{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Start Date</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">End Date</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} className="input" />
        </div>
        <button type="button" onClick={handleReset} className="btn-secondary w-full">
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default BookingFilter
