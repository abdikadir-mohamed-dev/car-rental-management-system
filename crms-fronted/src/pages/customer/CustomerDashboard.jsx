import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Car,
  Calendar,
  CreditCard,
  MapPin,
  Search,
  Star,
  Users,
  User,
  FileText,
  CheckCircle,
} from 'lucide-react'

import { getVehicles } from '../../services/vehicleService'
import { getBookings } from '../../services/bookingService'
import { mapVehicle, mapBooking } from '../../utils/apiMappers'

function CustomerDashboard() {
  const { user } = useSelector((state) => state.auth)

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const [vehicles, setVehicles] = useState([])
  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [vehiclesData, bookingsData] = await Promise.all([
          getVehicles(),
          getBookings(),
        ])

        // Vehicles API
        const vehicleList = Array.isArray(vehiclesData)
          ? vehiclesData
          : vehiclesData?.vehicles || []

        setVehicles(vehicleList.map(mapVehicle))

        // Bookings API
        const bookingList = Array.isArray(bookingsData)
          ? bookingsData
          : bookingsData?.bookings || []

        setBookings(bookingList.map(mapBooking))
      } catch (err) {
        console.error('Failed to load customer dashboard:', err)

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load dashboard data'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // =========================
  // BOOKING DATA
  // =========================

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === 'pending' ||
      booking.status === 'confirmed'
  )

  const upcomingBooking = upcomingBookings[0] || null

  const recentBookings = bookings
    .filter(
      (booking) =>
        booking.status === 'completed' ||
        booking.status === 'cancelled'
    )
    .slice(0, 3)

  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed'
  )

  const recommendedVehicles = vehicles
    .filter((vehicle) => vehicle.available !== false)
    .slice(0, 4)

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalSpent = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.totalPrice || 0),
    0
  )

  const stats = {
    totalBookings: bookings.length,

    upcoming: upcomingBookings.length,

    completed: completedBookings.length,

    totalSpent,
  }

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (pickupLocation) {
      params.set('location', pickupLocation)
    }

    if (pickupDate) {
      params.set('pickupDate', pickupDate)
    }

    if (returnDate) {
      params.set('returnDate', returnDate)
    }

    window.location.href = `/customer/browse?${params.toString()}`
  }

  // =========================
  // VEHICLE FINDER
  // =========================

  const getVehicleForBooking = (booking) => {
    if (!booking) {
      return null
    }

    return (
      vehicles.find(
        (vehicle) =>
          String(vehicle.id) ===
          String(booking.vehicleId)
      ) ||
      booking.vehicle ||
      null
    )
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="space-y-6">

      {/* =========================
          WELCOME
      ========================= */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Good morning,{' '}
          {user?.name?.split(' ')[0] || 'Customer'}!
        </h1>

        <p className="text-slate-600 mt-1">
          Ready to find your next amazing ride?
        </p>
      </div>

      {/* =========================
          SEARCH / HERO
      ========================= */}

      <div className="card p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              Find your perfect car
            </h2>

            <p className="text-blue-100 mb-4">
              Book your ride in just a few clicks.
            </p>

            <form
              onSubmit={handleSearch}
              className="space-y-3"
            >
              {/* Pickup Location */}

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">
                  Pick-up Location
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) =>
                      setPickupLocation(e.target.value)
                    }
                    placeholder="Enter pickup location"
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Dates */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-1">
                    Pick-up Date
                  </label>

                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) =>
                      setPickupDate(e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-1">
                    Return Date
                  </label>

                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) =>
                      setReturnDate(e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg text-slate-900 text-sm"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search Cars
              </button>
            </form>
          </div>

          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"
              alt="Premium car"
              className="rounded-lg shadow-lg"
            />
          </div>

        </div>
      </div>

      {/* =========================
          STATISTICS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Bookings */}

        <div className="card p-6">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-600">
                Total Bookings
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.totalBookings}
              </p>
            </div>

          </div>
        </div>

        {/* Upcoming */}

        <div className="card p-6">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-success" />
            </div>

            <div>
              <p className="text-sm text-slate-600">
                Upcoming
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.upcoming}
              </p>
            </div>

          </div>
        </div>

        {/* Completed */}

        <div className="card p-6">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-warning" />
            </div>

            <div>
              <p className="text-sm text-slate-600">
                Completed
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {stats.completed}
              </p>
            </div>

          </div>
        </div>

        {/* Total Spent */}

        <div className="card p-6">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-600">
                Total Spent
              </p>

              <p className="text-2xl font-bold text-slate-900">
                KES {stats.totalSpent.toLocaleString()}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          {/* =========================
              UPCOMING BOOKING
          ========================= */}

          {upcomingBooking && (
            <div className="card p-6">

              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Upcoming Booking
              </h2>

              {(() => {
                const vehicle =
                  getVehicleForBooking(upcomingBooking)

                return (
                  <div className="flex gap-4">

                    {vehicle?.image ? (
                      <img
                        src={vehicle.image}
                        alt={vehicle.name || 'Vehicle'}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-slate-400 text-sm">
                          No image
                        </span>
                      </div>
                    )}

                    <div className="flex-1">

                      <div className="flex items-start justify-between">

                        <div>

                          <h3 className="font-semibold text-slate-900">
                            {vehicle?.name || 'Vehicle'}
                          </h3>

                          <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-success text-xs rounded-full font-medium capitalize">
                            {upcomingBooking.status}
                          </span>

                        </div>

                        <p className="text-lg font-bold text-blue-600">
                          KES{' '}
                          {Number(
                            upcomingBooking.totalPrice || 0
                          ).toLocaleString()}
                        </p>

                      </div>

                      <div className="mt-3 space-y-1 text-sm text-slate-600">

                        <p>
                          {upcomingBooking.pickupDate || '-'}
                          {' - '}
                          {upcomingBooking.returnDate || '-'}
                        </p>

                        <p>
                          {upcomingBooking.pickupLocation || '-'}
                        </p>

                        <p>
                          {upcomingBooking.duration || 1} Days
                        </p>

                      </div>

                      <div className="mt-4 flex gap-2">

                        <Link
                          to={`/customer/my-bookings/${upcomingBooking.id}`}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                        >
                          Cancel Booking
                        </Link>

                        <Link
                          to={`/customer/my-bookings/${upcomingBooking.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                        >
                          View Booking
                        </Link>

                      </div>

                    </div>
                  </div>
                )
              })()}

            </div>
          )}

          {/* =========================
              NO UPCOMING BOOKING
          ========================= */}

          {!upcomingBooking && (
            <div className="card p-6">

              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                No Upcoming Booking
              </h2>

              <p className="text-slate-600 mb-4">
                You don't currently have a pending or confirmed booking.
              </p>

              <Link
                to="/customer/browse"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Car className="w-4 h-4" />
                Browse Cars
              </Link>

            </div>
          )}

          {/* =========================
              RECENT BOOKINGS
          ========================= */}

          <div className="card p-6">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-semibold text-slate-900">
                Recent Bookings
              </h2>

              <Link
                to="/customer/my-bookings"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </Link>

            </div>

            {recentBookings.length === 0 ? (
              <div className="py-8 text-center">

                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                <p className="text-slate-500">
                  No completed or cancelled bookings yet.
                </p>

              </div>
            ) : (
              <div className="space-y-3">

                {recentBookings.map((booking) => {

                  const vehicle =
                    getVehicleForBooking(booking)

                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >

                      <div className="flex items-center gap-3">

                        {vehicle?.image ? (
                          <img
                            src={vehicle.image}
                            alt={vehicle.name || 'Vehicle'}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Car className="w-5 h-5 text-slate-400" />
                          </div>
                        )}

                        <div>

                          <p className="font-medium text-slate-900">
                            {vehicle?.name || 'Vehicle'}
                          </p>

                          <p className="text-sm text-slate-500">
                            {booking.pickupDate || '-'}
                            {' - '}
                            {booking.returnDate || '-'}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <div className="text-right">

                          <p className="font-bold text-blue-600">
                            KES{' '}
                            {Number(
                              booking.totalPrice || 0
                            ).toLocaleString()}
                          </p>

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                              booking.status === 'completed'
                                ? 'bg-emerald-100 text-success'
                                : 'bg-red-100 text-danger'
                            }`}
                          >
                            {booking.status}
                          </span>

                        </div>

                        <div className="flex flex-col gap-2">

                          <Link
                            to={`/customer/agreements/${booking.id}`}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            Agreement
                          </Link>

                          <Link
                            to={`/customer/agreements/${booking.id}?confirmation=true`}
                            className="text-xs text-slate-600 hover:underline flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Confirmation
                          </Link>

                          {booking.status === 'completed' && (
                            <Link
                              to={`/customer/reviews?booking=${booking.id}`}
                              className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" />
                              Add Review
                            </Link>
                          )}

                        </div>

                      </div>

                    </div>
                  )
                })}

              </div>
            )}

          </div>

          {/* =========================
              LEAVE A REVIEW
          ========================= */}

          {completedBookings.length > 0 && (
            <div className="card p-6">

              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Leave a Review
              </h2>

              <p className="text-sm text-slate-500 mb-4">
                How was your recent rental? Share your experience.
              </p>

              <div className="space-y-3">

                {completedBookings
                  .slice(0, 3)
                  .map((booking) => {

                    const vehicle =
                      getVehicleForBooking(booking)

                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >

                        <div className="flex items-center gap-3">

                          {vehicle?.image ? (
                            <img
                              src={vehicle.image}
                              alt={vehicle.name || 'Vehicle'}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                              <Car className="w-5 h-5 text-slate-400" />
                            </div>
                          )}

                          <div>

                            <p className="font-medium text-slate-900">
                              {vehicle?.name || 'Vehicle'}
                            </p>

                            <p className="text-sm text-slate-500">
                              {booking.pickupDate || '-'}
                              {' - '}
                              {booking.returnDate || '-'}
                            </p>

                          </div>

                        </div>

                        <Link
                          to={`/customer/reviews?booking=${booking.id}`}
                          className="btn-primary text-sm"
                        >
                          Add Review
                        </Link>

                      </div>
                    )
                  })}

              </div>

            </div>
          )}

        </div>

        {/* =========================
            RIGHT SIDEBAR
        ========================= */}

        <div className="space-y-6">

          {/* Quick Actions */}

          <div className="card p-6">

            <h3 className="font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <Link
                to="/customer/browse"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Car className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Browse Cars
                </span>
              </Link>

              <Link
                to="/customer/my-bookings"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  My Bookings
                </span>
              </Link>

              <Link
                to="/customer/payments"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Payments
                </span>
              </Link>

              <Link
                to="/customer/profile"
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <User className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  Profile
                </span>
              </Link>

            </div>

          </div>

          {/* Recommended Vehicles */}

          <div className="card p-6">

            <h3 className="font-semibold text-slate-900 mb-4">
              Recommended For You
            </h3>

            {recommendedVehicles.length === 0 ? (
              <p className="text-sm text-slate-500">
                No vehicles available right now.
              </p>
            ) : (
              <div className="space-y-3">

                {recommendedVehicles.map((vehicle) => (

                  <Link
                    key={vehicle.id}
                    to={`/customer/vehicles/${vehicle.id}`}
                    className="flex gap-3 group"
                  >

                    {vehicle.image ? (
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-16 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-slate-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">

                      <h4 className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                        {vehicle.name}
                      </h4>

                      <p className="text-xs text-slate-500 capitalize">
                        {vehicle.category || 'Vehicle'}
                      </p>

                      <div className="flex items-center gap-1 mt-1">

                        <Star className="w-3 h-3 text-amber-400 fill-current" />

                        <span className="text-xs font-medium text-slate-700">
                          {vehicle.rating || 'N/A'}
                        </span>

                      </div>

                      <p className="text-sm font-bold text-blue-600 mt-1">
                        KES{' '}
                        {Number(
                          vehicle.pricePerDay || 0
                        ).toLocaleString()}
                        /day
                      </p>

                    </div>

                  </Link>

                ))}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default CustomerDashboard