import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import VehicleCard from '../../components/vehicles/VehicleCard'
import VehicleFilter from '../../components/vehicles/VehicleFilter'
import Loader from '../../components/common/Loader'
import { SlidersHorizontal, Search } from 'lucide-react'

function VehicleBrowsePage() {
  const dispatch = useDispatch()
  const { vehicles, loading } = useSelector((state) => state.vehicles)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  })

  useEffect(() => {
    dispatch(fetchVehicles({}))
  }, [dispatch])

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = !filters.search ||
        vehicle.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(filters.search.toLowerCase())

      const matchesType = !filters.type || vehicle.type === filters.type

      const matchesMinPrice = !filters.minPrice || vehicle.pricePerDay >= Number(filters.minPrice)

      const matchesMaxPrice = !filters.maxPrice || vehicle.pricePerDay <= Number(filters.maxPrice)

      return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice
    })
  }, [vehicles, filters])

  const handleFilter = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse Cars</h1>
        <p className="text-slate-600 mt-1">Find and book the perfect vehicle for your needs</p>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search vehicles..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-600">{filteredVehicles.length} vehicles available</p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden btn-secondary flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <VehicleFilter onFilter={handleFilter} />
        </div>
        <div className="flex-1">
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} to={`/customer/vehicles/${vehicle._id}`} />
              ))}
            </div>
          )}
          {!loading && filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No vehicles found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VehicleBrowsePage
