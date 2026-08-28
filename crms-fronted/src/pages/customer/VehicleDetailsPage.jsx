import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Users, Gauge, Fuel, MapPin, Calendar, Heart, ArrowLeft, Check } from 'lucide-react'
import { getVehicle } from '../../services/vehicleService'
import { getDrivers } from '../../services/driverService'
import { mapVehicle } from '../../utils/apiMappers'
import toast from 'react-hot-toast'
import AvailabilityCalendar from '../../components/customer/AvailabilityCalendar'

function VehicleDetailsPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [liked, setLiked] = useState(false)
  const [drivingOption, setDrivingOption] = useState('self')
  const [selectedDriver, setSelectedDriver] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [vehicleData, driversData] = await Promise.all([
          getVehicle(id),
          getDrivers(),
        ])
        setVehicle(mapVehicle(vehicleData))
        setDrivers(driversData || [])
      } catch (err) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Not Found</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <Link to="/customer/browse" className="text-blue-600 hover:text-blue-700 font-medium">Back to Browse Cars</Link>
        </div>
      </div>
    )
  }

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))
    : 1
  const vehicleCost = days * vehicle.pricePerDay
  const driverCost = drivingOption === 'hire' && selectedDriver ? days * selectedDriver.pricePerDay : 0
  const totalPrice = vehicleCost + driverCost

  const availableDrivers = drivers.filter(d => d.available)

  const handleContinue = () => {
    if (!pickupDate || !returnDate) {
      toast.error('Please select pick-up and return dates')
      return
    }
    if (drivingOption === 'hire' && !selectedDriver) {
      toast.error('Please select a driver')
      return
    }
    window.location.href = `/customer/booking/${vehicle.id}?pickup=${pickupDate}&return=${returnDate}&option=${drivingOption}&driver=${selectedDriver?.id || ''}`
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/customer/browse" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Browse Cars
          </Link>
          <h1 className="text-3xl font-bold">{vehicle.name}</h1>
          <p className="text-slate-300">{vehicle.brand} · {vehicle.category} · {vehicle.location}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                <img
                  src={vehicle.images[selectedImage]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-3">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-blue-600' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Car</h2>
                <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Seats</p>
                  <p className="font-semibold text-slate-900">{vehicle.seats}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Gauge className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Doors</p>
                  <p className="font-semibold text-slate-900">{vehicle.doors}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Fuel className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Transmission</p>
                  <p className="font-semibold text-slate-900">{vehicle.transmission}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Fuel className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Fuel Type</p>
                  <p className="font-semibold text-slate-900">{vehicle.fuelType}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">KES {vehicle.pricePerDay}</span>
                    <span className="text-slate-500">/day</span>
                  </div>
                  <button
                    onClick={() => setLiked(!liked)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1 mb-6">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  <span className="font-medium text-slate-900">{vehicle.rating}</span>
                  <span className="text-slate-500">(120 reviews)</span>
                </div>

                <div className="border-t border-slate-200 pt-4 mb-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Check Availability</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pick-up Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          defaultValue={vehicle.location}
                          className="input pl-9 bg-slate-50"
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pick-up Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="input pl-9 bg-slate-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="input pl-9 bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <AvailabilityCalendar
                    vehicleId={vehicle.id}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                  />
                </div>

                <div className="border-t border-slate-200 pt-4 mb-4">
                  <h3 className="font-semibold text-slate-900 mb-3">How would you like to travel?</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setDrivingOption('self')}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        drivingOption === 'self' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-medium text-slate-900">Drive Myself</p>
                      <p className="text-sm text-slate-600">I will drive the vehicle myself</p>
                    </button>
                    <button
                      onClick={() => setDrivingOption('hire')}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        drivingOption === 'hire' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-medium text-slate-900">Hire a Driver</p>
                      <p className="text-sm text-slate-600">I would like a professional driver</p>
                    </button>
                  </div>
                </div>

                {drivingOption === 'hire' && (
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Choose Your Driver</h3>
                    <div className="space-y-3">
                      {availableDrivers.map((driver) => (
                        <button
                          key={driver.id}
                          onClick={() => setSelectedDriver(driver)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                            selectedDriver?.id === driver.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={driver.image} alt={driver.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{driver.name}</p>
                              <p className="text-sm text-slate-600">{driver.experience} · ⭐ {driver.rating}</p>
                              <p className="text-sm text-slate-600">{driver.languages}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">KES {driver.pricePerDay}/day</p>
                              {selectedDriver?.id === driver.id && (
                                <span className="text-xs text-blue-600 font-medium">Selected</span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {pickupDate && returnDate && (
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Vehicle ({days} day{days > 1 ? 's' : ''})</span>
                      <span className="font-medium text-slate-900">KES {vehicleCost.toLocaleString()}</span>
                    </div>
                    {drivingOption === 'hire' && selectedDriver && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Driver ({days} day{days > 1 ? 's' : ''})</span>
                        <span className="font-medium text-slate-900">KES {driverCost.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-blue-600">KES {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  disabled={!pickupDate || !returnDate}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VehicleDetailsPage
