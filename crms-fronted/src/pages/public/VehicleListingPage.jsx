import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import VehicleCard from '../../components/vehicles/VehicleCard'
import VehicleFilter from '../../components/vehicles/VehicleFilter'
import Loader from '../../components/common/Loader'
import { SlidersHorizontal } from 'lucide-react'

function VehicleListingPage() {
  const dispatch = useDispatch()
  const { vehicles, loading } = useSelector((state) => state.vehicles)
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
  })

  useEffect(() => {
    dispatch(fetchVehicles({ ...filters }))
  }, [dispatch, filters])

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">{vehicles.length} vehicles available</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                  ))}
                </div>
              )}
              {!loading && vehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">No vehicles found matching your criteria.</p>
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
