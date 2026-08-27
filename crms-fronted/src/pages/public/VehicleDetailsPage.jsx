import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Users, Gauge, Fuel, MapPin, Calendar, Heart, ArrowLeft, Check } from 'lucide-react'
import { getVehicle } from '../../services/vehicleService'
import toast from 'react-hot-toast'

function VehicleDetailsPage() {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true)
      try {
        const response = await getVehicle(id)
        const v = response.data
        setVehicle({
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
        })
      } catch (error) {
        toast.error('Failed to load vehicle details')
      } finally {
        setLoading(false)
      }
    }
    loadVehicle()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Not Found</h1>
          <Link to="/vehicles" className="text-blue-600 hover:text-blue-700 font-medium">Back to Browse Cars</Link>
        </div>
      </div>
    )
  }

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))
    : 1
  const totalPrice = days * vehicle.pricePerDay

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/vehicles" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
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

                {pickupDate && returnDate && (
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">KES {vehicle.pricePerDay} x {days} day{days > 1 ? 's' : ''}</span>
                      <span className="font-medium text-slate-900">KES {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Service fee</span>
                      <span className="font-medium text-slate-900">KES 500</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-blue-600">KES {(totalPrice + 500).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!pickupDate || !returnDate) {
                      toast.error('Please select pick-up and return dates')
                      return
                    }
                    toast.success(`Booking request sent for ${vehicle.name}!`)
                  }}
                  className="btn-primary w-full py-3"
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
