import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Shield, Clock, DollarSign, Car } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicles } from '../../redux/slices/vehicleSlice'
import VehicleCard from '../../components/vehicles/VehicleCard'
import Loader from '../../components/common/Loader'

function HomePage() {
  const dispatch = useDispatch()
  const { vehicles, loading } = useSelector((state) => state.vehicles)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchVehicles({ limit: 6 }))
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/vehicles?search=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div>
      <section className="relative bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find, Book & Drive Your Dream Car
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Choose from our wide selection of vehicles and book quickly for a seamless rental experience.
            </p>
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                placeholder="Search for vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-white outline-none"
              />
              <button type="submit" className="bg-white text-slate-900 hover:bg-blue-50 flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors">
                <Search className="w-5 h-5" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Popular Cars</h2>
            <Link to="/vehicles" className="text-primary hover:text-primary-hover font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.slice(0, 6).map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Why Choose DriveGo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
              <p className="text-slate-600 text-sm">Choose from economy to luxury vehicles for every occasion.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-slate-600 text-sm">Competitive rates and exclusive deals for all customers.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-slate-600 text-sm">Book your car in minutes with our simple online process.</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-slate-600 text-sm">Round-the-clock assistance for a worry-free rental.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-2">Pick your dates</h3>
              <p className="text-slate-600 text-sm">Select your pickup and return dates.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-2">Pick your car</h3>
              <p className="text-slate-600 text-sm">Browse and choose from our fleet.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-2">Book & pay</h3>
              <p className="text-slate-600 text-sm">Complete your booking and payment.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-lg font-semibold mb-2">Drive & enjoy</h3>
              <p className="text-slate-600 text-sm">Pick up your car and enjoy the ride.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">First Time Here?</h2>
          <p className="text-xl text-blue-100 mb-8">Get 20% off your first rental. Sign up now and start driving!</p>
          <Link to="/auth/register" className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Create Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
