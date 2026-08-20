import { useState } from 'react'
import { Search, MapPin, Calendar, SlidersHorizontal } from 'lucide-react'
import { VEHICLE_TYPES } from '../../utils/constants'

function VehicleSearch({ onSearch, compact = false }) {
  const [filters, setFilters] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    dropoffDate: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  })

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value }
    setFilters(newFilters)
    onSearch?.(newFilters)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(filters)
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="pickupLocation"
              placeholder="Pickup location"
              value={filters.pickupLocation}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="dropoffLocation"
              placeholder="Return location"
              value={filters.dropoffLocation}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              name="pickupDate"
              value={filters.pickupDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              name="dropoffDate"
              value={filters.dropoffDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-slate-900">Find Your Perfect Vehicle</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label">Pickup Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="pickupLocation"
              value={filters.pickupLocation}
              onChange={handleChange}
              className="input pl-10"
              placeholder="City or airport"
            />
          </div>
        </div>
        <div>
          <label className="label">Return Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="dropoffLocation"
              value={filters.dropoffLocation}
              onChange={handleChange}
              className="input pl-10"
              placeholder="Same as pickup"
            />
          </div>
        </div>
        <div>
          <label className="label">Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={filters.pickupDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="label">Return Date</label>
          <input
            type="date"
            name="dropoffDate"
            value={filters.dropoffDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="label">Category</label>
          <select name="category" value={filters.category} onChange={handleChange} className="input">
            <option value="">All Categories</option>
            {Object.entries(VEHICLE_TYPES).map(([key, value]) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Price Range (KES/day)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              className="input"
              placeholder="Min"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              className="input"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => setFilters({ pickupLocation: '', dropoffLocation: '', pickupDate: '', dropoffDate: '', category: '', minPrice: '', maxPrice: '' })} className="text-sm text-slate-500 hover:text-slate-700">
          Clear filters
        </button>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search Vehicles
        </button>
      </div>
    </form>
  )
}

export default VehicleSearch
