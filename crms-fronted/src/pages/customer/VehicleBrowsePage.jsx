import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import VehicleCard from '../../components/vehicles/VehicleCard'
import Loader from '../../components/common/Loader'

function VehicleBrowsePage() {
  const dispatch = useDispatch()
  const { vehicles, loading } = useSelector((state) => state.vehicles)

  useEffect(() => {
    dispatch(fetchVehicles({}))
  }, [dispatch])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse Cars</h1>
        <p className="text-slate-600 mt-1">Find and book the perfect vehicle for your needs</p>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
      {!loading && vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No vehicles available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default VehicleBrowsePage
