import { useState } from 'react'
import { VEHICLE_TYPES } from '../../utils/constants'
import { SlidersHorizontal } from 'lucide-react'

function VehicleFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
  })

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleReset = () => {
    const resetFilters = { type: '', minPrice: '', maxPrice: '' }
    setFilters(resetFilters)
    onFilter(resetFilters)
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="label">Vehicle Type</label>
          <select name="type" value={filters.type} onChange={handleChange} className="input">
            <option value="">All Types</option>
            {Object.values(VEHICLE_TYPES).map((type) => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Min Price ($)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className="input"
            placeholder="0"
          />
        </div>
        <div>
          <label className="label">Max Price ($)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className="input"
            placeholder="1000"
          />
        </div>
        <button type="button" onClick={handleReset} className="btn-secondary w-full">
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default VehicleFilter
