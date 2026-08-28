import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Shield, Clock, DollarSign, Car, Star, MapPin, Calendar, Users, Fuel, Gauge } from 'lucide-react'
import { getVehicles } from '../../services/vehicleService'
import { mapVehicle } from '../../utils/apiMappers'

function HomePage() {
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const locations = [
    'Nairobi CBD',
    'Westlands',
    'Kilimani',
    'Karen',
    'Industrial Area',
    'Jomo Kenyatta Airport',
    'Nairobi West',
  ]

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        const data = await getVehicles()
        setVehicles((data || []).map(mapVehicle))
      } catch (err) {
        setError(err.message || 'Failed to load vehicles')
      } finally {
        setLoading(false)
      }
    }
    loadVehicles()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (pickupLocation) params.set('location', pickupLocation)
    if (pickupDate) params.set('pickupDate', pickupDate)
    if (returnDate) params.set('returnDate', returnDate)
    window.location.href = `/vehicles?${params.toString()}`
  }

  return (
    <div>
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-slate-900/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=800&fit=crop"
          alt="Luxury car on city road"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Find, Book & Drive Your <span className="text-white">Dream Car</span>
            </h1>
            <p className="text-xl text-slate-100 mb-10">
              Choose from a wide range of reliable vehicles and book your perfect ride in just a few clicks.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pick-up Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="input pl-10 bg-slate-50 text-slate-900"
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pick-up Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="input pl-10 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="input pl-10 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                    <Search className="w-5 h-5" />
                    Search Cars
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Popular Cars</h2>
            <Link to="/vehicles" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500">{error}</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 text-lg">No vehicles found.</p>
                <Link to="/vehicles" className="text-blue-600 hover:text-blue-700 font-medium mt-2">Browse all cars</Link>
              </div>
            ) : (
              vehicles.slice(0, 8).map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Choose DriveGo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Wide Selection</h3>
              <p className="text-slate-600 text-sm">Choose from economy cars to luxury vehicles.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Best Prices</h3>
              <p className="text-slate-600 text-sm">Competitive rates and great offers.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Easy Booking</h3>
              <p className="text-slate-600 text-sm">Book your car in just a few simple steps.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">24/7 Support</h3>
              <p className="text-slate-600 text-sm">We are here to help whenever you need us.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get 15% Off Your First Booking</h2>
          <p className="text-xl text-blue-100 mb-2">Use code: <span className="font-bold text-white">DRIVE15</span></p>
          <p className="text-blue-100 mb-8">New customers get exclusive discount on their first rental</p>
          <Link to="/vehicles" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Book Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Choose Location</h3>
              <p className="text-slate-600 text-sm">Select your pick-up and drop-off location.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Pick Your Car</h3>
              <p className="text-slate-600 text-sm">Browse and choose your ideal car.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Book & Pay</h3>
              <p className="text-slate-600 text-sm">Secure your booking online.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">Drive & Enjoy</h3>
              <p className="text-slate-600 text-sm">Pick up your car and enjoy the ride.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function VehicleCard({ vehicle }) {
  return (
    <Link to={`/vehicles/${vehicle.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {vehicle.name}
            </h3>
            <span className="bg-blue-100 text-blue-700 capitalize text-xs px-2 py-1 rounded-full font-medium">{vehicle.category}</span>
          </div>
          <p className="text-sm text-slate-500">{vehicle.brand}</p>
        </div>

        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-sm font-medium text-slate-700">{vehicle.rating}</span>
          <span className="text-sm text-slate-500">(120 reviews)</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {vehicle.seats} Seats
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            {vehicle.fuelType}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-xl font-bold text-blue-600">KES {vehicle.pricePerDay}</span>
            <span className="text-sm text-slate-500">/day</span>
          </div>
          <span className="text-blue-600 font-medium text-sm group-hover:underline">View Details</span>
        </div>
      </div>
    </Link>
  )
}

export default HomePage
