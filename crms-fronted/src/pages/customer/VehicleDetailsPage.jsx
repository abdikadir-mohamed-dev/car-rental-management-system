import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicle } from '../../redux/slices/vehicleSlice'
import { ArrowLeft, Users, Gauge, Fuel, Calendar, Star } from 'lucide-react'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/formatCurrency'
import BookingForm from '../../components/booking/BookingForm'

function VehicleDetailsPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentVehicle, loading } = useSelector((state) => state.vehicles)
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    dispatch(fetchVehicle(id))
  }, [dispatch, id])

  if (loading) return <Loader />

  if (!currentVehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Vehicle not found</p>
        <Link to="/customer/vehicles" className="btn-primary mt-4 inline-block">Back to Vehicles</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/customer/vehicles" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Vehicles
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            {currentVehicle.image ? (
              <img src={currentVehicle.image} alt={currentVehicle.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-slate-400 text-lg">No Image</span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentVehicle.name}</h1>
              <p className="text-lg text-slate-600 capitalize">{currentVehicle.type} - {currentVehicle.brand} {currentVehicle.model} ({currentVehicle.year})</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <span className="font-medium text-slate-700">4.8</span>
            </div>
          </div>
          
          <p className="text-3xl font-bold text-primary mb-6">{formatCurrency(currentVehicle.pricePerDay)}<span className="text-lg text-slate-500 font-normal">/day</span></p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-5 h-5" />
              <span>{currentVehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Gauge className="w-5 h-5" />
              <span className="capitalize">{currentVehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Fuel className="w-5 h-5" />
              <span className="capitalize">{currentVehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-5 h-5" />
              <span>{currentVehicle.year}</span>
            </div>
          </div>
          
          {currentVehicle.features && currentVehicle.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {currentVehicle.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm">{feature}</span>
                ))}
              </div>
            </div>
          )}
          
          {currentVehicle.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600">{currentVehicle.description}</p>
            </div>
          )}
          
          <button onClick={() => setShowBookingForm(true)} className="btn-primary w-full">Book Now</button>
        </div>
      </div>
      {showBookingForm && <BookingForm vehicle={currentVehicle} onClose={() => setShowBookingForm(false)} />}
    </div>
  )
}

export default VehicleDetailsPage
