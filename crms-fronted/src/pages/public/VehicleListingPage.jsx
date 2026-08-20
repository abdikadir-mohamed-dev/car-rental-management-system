import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import VehicleCard from '../../components/vehicles/VehicleCard'
import VehicleFilter from '../../components/vehicles/VehicleFilter'
import { mockVehicles } from '../../data/mockData'

function VehicleListingPage() {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('popular')
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    category: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
  })

  const filteredVehicles = useMemo(() => {
    let result = [...mockVehicles]

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.brand.toLowerCase().includes(term) ||
        v.category.toLowerCase().includes(term)
      )
    }

    if (filters.location) {
      result = result.filter(v => v.location === filters.location)
    }

    if (filters.category) {
      result = result.filter(v => v.category === filters.category)
    }

    if (filters.transmission) {
      result = result.filter(v => v.transmission === filters.transmission)
    }

    if (filters.fuelType) {
      result = result.filter(v => v.fuelType === filters.fuelType)
    }

    if (filters.minPrice) {
      result = result.filter(v => v.pricePerDay >= Number(filters.minPrice))
    }

    if (filters.maxPrice) {
      result = result.filter(v => v.pricePerDay <= Number(filters.maxPrice))
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay)
        break
      case 'price-high':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return result
  }, [search, filters, sortBy])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleReset = () => {
    setFilters({
      location: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: '',
    })
    setSearch('')
    setSortBy('popular')
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  return (
    <div>
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse Our Fleet</h1>
          <p className="text-xl text-slate-300">Find the perfect vehicle for your journey</p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-slate-600">{filteredVehicles.length} vehicles available</p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="input pl-9 sm:w-48"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-72 flex-shrink-0">
              <VehicleFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
            <div className="flex-1">
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No vehicles found matching your criteria.</p>
                  <button onClick={handleReset} className="text-blue-600 hover:text-blue-700 font-medium mt-2">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VehicleListingPage
