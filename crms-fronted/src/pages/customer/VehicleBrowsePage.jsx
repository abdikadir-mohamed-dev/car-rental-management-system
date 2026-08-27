import { useState, useMemo, useEffect } from 'react'
import { Heart, Star, Users, Gauge, Fuel } from 'lucide-react'
import VehicleCard from '../../components/vehicles/VehicleCard'
import { getVehicles } from '../../services/vehicleService'

function VehicleBrowsePage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
  })
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true)
      try {
        const response = await getVehicles()
        const mapped = (response.data || []).map((v) => ({
          id: v.id,
          name: `${v.make} ${v.model}`,
          brand: v.make,
          category: v.vehicleType,
          pricePerDay: v.dailyRentalRate,
          rating: 4.5,
          seats: v.seatingCapacity || 5,
          doors: 4,
          transmission: v.transmission,
          fuelType: v.fuelType,
          luggage: 2,
          location: v.location,
          image: v.images?.[0] || '/placeholder-car.jpg',
          images: v.images || [],
          features: v.features || [],
          description: v.description || '',
          available: v.available,
        }))
        setVehicles(mapped)
      } catch (error) {
        console.error('Failed to load vehicles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadVehicles()
  }, [])

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles]

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
    }

    return result
  }, [search, filters, sortBy, vehicles])

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value })
  }

  const handleReset = () => {
    setFilters({ location: '', category: '', minPrice: '', maxPrice: '', transmission: '', fuelType: '' })
    setSearch('')
    setSortBy('popular')
  }

  return (
    <div>
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse Cars</h1>
          <p className="text-xl text-slate-300">Find the perfect vehicle for your next journey</p>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-slate-600">{loading ? 'Loading...' : `${filteredVehicles.length} vehicles available`}</p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by brand or model"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input flex-1 sm:flex-none sm:w-64"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input sm:w-48"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Filters</h3>
                  <button onClick={handleReset} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Reset</button>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="input"
                    >
                      <option value="">All Locations</option>
                      <option value="Nairobi CBD">Nairobi CBD</option>
                      <option value="Westlands">Westlands</option>
                      <option value="Kilimani">Kilimani</option>
                      <option value="Karen">Karen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input"
                    >
                      <option value="">All Categories</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Van">Van</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Price Range (KES/day)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="input"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Transmission</label>
                    <select
                      value={filters.transmission}
                      onChange={(e) => handleFilterChange('transmission', e.target.value)}
                      className="input"
                    >
                      <option value="">All</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
                    <select
                      value={filters.fuelType}
                      onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                      className="input"
                    >
                      <option value="">All</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} to={`/customer/vehicles/${vehicle.id}`} />
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

export default VehicleBrowsePage
