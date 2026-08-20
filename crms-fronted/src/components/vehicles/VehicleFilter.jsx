import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { vehicleCategories, transmissionTypes, fuelTypes, mockLocations } from '../../data/mockData'

function VehicleFilter({ filters, onChange, onReset, sortBy, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Filters</h3>
        <button onClick={() => { onReset(); onSortChange('popular') }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Reset All</button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
        <select
          value={filters.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          className="input"
        >
          <option value="">All Locations</option>
          {mockLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="input"
        >
          <option value="">All Categories</option>
          {vehicleCategories.filter(c => c !== 'All').map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Price Range (KES/day)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Transmission</label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => handleChange('transmission', e.target.value)}
          className="input"
        >
          <option value="">All</option>
          {transmissionTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => handleChange('fuelType', e.target.value)}
          className="input"
        >
          <option value="">All</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="hidden lg:block">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <FilterContent />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Filters</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VehicleFilter
