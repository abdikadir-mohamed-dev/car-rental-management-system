import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const vehicleCategories = ['All', 'Sedan', 'SUV', 'Hatchback', 'Luxury', 'Van', 'Sports', 'Electric']
const transmissionTypes = ['Automatic', 'Manual']
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const locations = [
  'Nairobi CBD',
  'Westlands',
  'Kilimani',
  'Karen',
  'Industrial Area',
  'Jomo Kenyatta Airport',
  'Nairobi West',
]

function FilterFields({ filters, onFieldChange, onReset, onSortChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Filters</h3>
        <button onClick={() => { onReset(); onSortChange('popular') }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Reset All</button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
        <select
          value={filters.location || ''}
          onChange={(e) => onFieldChange('location', e.target.value)}
          className="input"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onFieldChange('category', e.target.value)}
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
            onChange={(e) => onFieldChange('minPrice', e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFieldChange('maxPrice', e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Transmission</label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => onFieldChange('transmission', e.target.value)}
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
          onChange={(e) => onFieldChange('fuelType', e.target.value)}
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
}

function VehicleFilter({ filters, onChange, onReset, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (name, value) => {
    onChange({ ...filters, [name]: value })
  }

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
          <FilterFields filters={filters} onFieldChange={handleChange} onReset={onReset} onSortChange={onSortChange} />
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
              <FilterFields filters={filters} onFieldChange={handleChange} onReset={onReset} onSortChange={onSortChange} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VehicleFilter
