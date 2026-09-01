import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Banknote,
  Check,
} from 'lucide-react'

import { getVehicle } from '../../services/vehicleService'
import { getDrivers } from '../../services/driverService'
import { createBooking } from '../../services/bookingService'
import { mapVehicle } from '../../utils/apiMappers'

import toast from 'react-hot-toast'

function BookingPage() {
  const { vehicleId } = useParams()

  const [vehicle, setVehicle] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')

  const [drivingOption, setDrivingOption] = useState('self')
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Payment UI is kept for now, but payment processing is NOT connected.
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerPhone, setCustomerPhone] = useState('')

  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

  /*
   * Load vehicle and drivers
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [vehicleData, driversData] = await Promise.all([
          getVehicle(vehicleId),
          getDrivers(),
        ])

        const mappedVehicle = mapVehicle(vehicleData)

        setVehicle(mappedVehicle)
        setDrivers(driversData || [])

        /*
         * Use the vehicle location as the default
         * pickup and drop-off location.
         */
        if (mappedVehicle?.location) {
          setPickupLocation(mappedVehicle.location)
          setDropoffLocation(mappedVehicle.location)
        }
      } catch (err) {
        console.error('Failed to load booking data:', err)

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load data'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [vehicleId])

  /*
   * Read booking information from the URL
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const pickup = params.get('pickup')
    const returnD = params.get('return')
    const option = params.get('option')
    const driverId = params.get('driver')

    if (pickup) {
      setPickupDate(pickup)
    }

    if (returnD) {
      setReturnDate(returnD)
    }

    if (option) {
      setDrivingOption(option)
    }

    if (driverId && drivers.length > 0) {
      const driver = drivers.find(
        d => Number(d.id) === Number(driverId)
      )

      setSelectedDriver(driver || null)
    }
  }, [vehicleId, drivers])

  /*
   * Calculate rental duration
   */
  const days =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (
              new Date(returnDate) -
              new Date(pickupDate)
            ) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1

  /*
   * Calculate vehicle cost
   */
  const vehicleCost =
    days * (vehicle?.pricePerDay || 0)

  /*
   * Calculate driver cost
   */
  const driverCost =
    drivingOption === 'hire' && selectedDriver
      ? days * (selectedDriver.pricePerDay || 0)
      : 0

  /*
   * Total booking price
   */
  const totalPrice =
    vehicleCost + driverCost

  /*
   * Submit booking
   *
   * IMPORTANT:
   * Payment is intentionally NOT processed here.
   *
   * We are first making sure that:
   *
   * Customer
   *    ↓
   * BookingPage
   *    ↓
   * createBooking()
   *    ↓
   * Flask /api/bookings/
   *    ↓
   * PostgreSQL
   *
   * works correctly.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!pickupDate || !returnDate) {
      toast.error(
        'Please select pickup and return dates'
      )
      return
    }

    if (
      new Date(returnDate) <=
      new Date(pickupDate)
    ) {
      toast.error(
        'Return date must be after pickup date'
      )
      return
    }

    if (!pickupLocation.trim()) {
      toast.error(
        'Please enter a pickup location'
      )
      return
    }

    if (!dropoffLocation.trim()) {
      toast.error(
        'Please enter a drop-off location'
      )
      return
    }

    if (
      drivingOption === 'hire' &&
      !selectedDriver
    ) {
      toast.error(
        'Please select a driver'
      )
      return
    }

    setProcessing(true)

    try {
      /*
       * Backend expects:
       *
       * drivingOption = "self"
       * OR
       * drivingOption = "with_driver"
       *
       * The frontend uses "hire",
       * so convert it before sending.
       */
      const backendDrivingOption =
        drivingOption === 'hire'
          ? 'with_driver'
          : 'self'

      /*
       * Payload expected by Flask
       */
      const bookingData = {
        vehicleId: Number(vehicleId),

        pickupDate,

        returnDate,

        pickupLocation:
          pickupLocation.trim(),

        returnLocation:
          dropoffLocation.trim(),

        totalAmount:
          Math.round(totalPrice),

        drivingOption:
          backendDrivingOption,

        driverId:
          drivingOption === 'hire'
            ? selectedDriver?.id
            : null,
      }

      console.log(
        'Creating booking:',
        bookingData
      )

      /*
       * Create REAL booking
       */
      const booking =
        await createBooking(bookingData)

      console.log(
        'Booking created successfully:',
        booking
      )

      /*
       * Get booking ID returned by backend
       */
      const createdBookingId =
        booking?.id || booking?._id

      if (!createdBookingId) {
        throw new Error(
          'Booking was created but no booking ID was returned.'
        )
      }

      /*
       * Save booking ID
       */
      setBookingId(
        String(createdBookingId)
      )

      /*
       * Show confirmation
       */
      setConfirmed(true)

      toast.success(
        'Booking created successfully!'
      )

    } catch (err) {
      console.error(
        'Booking error:',
        err
      )

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to create booking'

      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  /*
   * Error state
   */
  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">

          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Vehicle Not Found
          </h1>

          <p className="text-slate-600 mb-4">
            {error}
          </p>

          <Link
            to="/customer/browse"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Browse
          </Link>

        </div>
      </div>
    )
  }

  /*
   * Booking confirmation
   */
  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">

        <div className="max-w-md w-full text-center">

          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Booking Submitted!
          </h1>

          <p className="text-slate-600 mb-6">
            Your booking for {vehicle.name} has been submitted and is awaiting confirmation.
          </p>

          <div className="card p-6 text-left space-y-3 mb-6">

            <p>
              <span className="text-slate-600">
                Booking ID:
              </span>{' '}
              <span className="font-medium text-slate-900">
                #{bookingId}
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Vehicle:
              </span>{' '}
              <span className="font-medium text-slate-900">
                {vehicle.name}
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Pickup:
              </span>{' '}
              <span className="font-medium text-slate-900">
                {pickupDate}
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Return:
              </span>{' '}
              <span className="font-medium text-slate-900">
                {returnDate}
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Pickup Location:
              </span>{' '}
              <span className="font-medium text-slate-900">
                {pickupLocation}
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Drop-off Location:
              </span>{' '}
              <span className="font-medium text-slate-900">
                {dropoffLocation}
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Driving Option:
              </span>{' '}
              <span className="font-medium text-slate-900">
                {drivingOption === 'hire'
                  ? 'Hire a Driver'
                  : 'Self Drive'}
              </span>
            </p>

            {selectedDriver && (
              <p>
                <span className="text-slate-600">
                  Driver:
                </span>{' '}
                <span className="font-medium text-slate-900">
                  {selectedDriver.name}
                </span>
              </p>
            )}

            <p>
              <span className="text-slate-600">
                Payment:
              </span>{' '}
              <span className="font-medium text-amber-600">
                Pending
              </span>
            </p>

            <p>
              <span className="text-slate-600">
                Total:
              </span>{' '}
              <span className="font-bold text-blue-600 text-lg">
                KES {totalPrice.toLocaleString()}
              </span>
            </p>

          </div>

          <div className="flex gap-3">

            <Link
              to="/customer/my-bookings"
              className="btn-primary flex-1"
            >
              View Booking
            </Link>

            <Link
              to="/customer"
              className="btn-secondary flex-1"
            >
              Dashboard
            </Link>

          </div>

        </div>
      </div>
    )
  }

  /*
   * Main booking page
   */
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <section className="bg-slate-900 text-white py-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to={`/customer/vehicles/${vehicle.id}`}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicle
          </Link>

          <h1 className="text-3xl font-bold">
            Complete Your Booking
          </h1>

          <p className="text-slate-300">
            Review and submit your rental
          </p>

        </div>

      </section>

      {/* Booking content */}
      <section className="py-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">

              {/* Booking Summary */}
              <div className="card p-6">

                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Booking Summary
                </h2>

                <div className="flex gap-4 mb-4">

                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {vehicle.name}
                    </h3>

                    <p className="text-sm text-slate-600">
                      {vehicle.category} · {vehicle.location}
                    </p>

                    <p className="text-lg font-bold text-blue-600 mt-1">
                      KES {vehicle.pricePerDay}/day
                    </p>

                  </div>

                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Vehicle ({days} day{days > 1 ? 's' : ''})
                    </span>

                    <span className="font-medium text-slate-900">
                      KES {vehicleCost.toLocaleString()}
                    </span>

                  </div>

                  {drivingOption === 'hire' &&
                    selectedDriver && (
                      <div className="flex justify-between">

                        <span className="text-slate-600">
                          Driver ({days} day{days > 1 ? 's' : ''})
                        </span>

                        <span className="font-medium text-slate-900">
                          KES {driverCost.toLocaleString()}
                        </span>

                      </div>
                    )}

                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">

                    <span>Total</span>

                    <span className="text-blue-600">
                      KES {totalPrice.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* Rental Locations */}
              <div className="card p-6">

                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Rental Locations
                </h2>

                <div className="space-y-4">

                  <div>

                    <label
                      htmlFor="pickupLocation"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Pickup Location
                    </label>

                    <input
                      id="pickupLocation"
                      type="text"
                      value={pickupLocation}
                      onChange={(e) =>
                        setPickupLocation(e.target.value)
                      }
                      placeholder="Enter pickup location"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="dropoffLocation"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Drop-off Location
                    </label>

                    <input
                      id="dropoffLocation"
                      type="text"
                      value={dropoffLocation}
                      onChange={(e) =>
                        setDropoffLocation(e.target.value)
                      }
                      placeholder="Enter drop-off location"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>

                </div>

              </div>

              {/* Payment Method */}
              <div className="card p-6">

                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3">

                  {/* CARD */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('card')
                    }
                    className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >

                    <CreditCard className="w-6 h-6 text-blue-600" />

                    <div>

                      <p className="font-medium text-slate-900">
                        Card
                      </p>

                      <p className="text-sm text-slate-600">
                        Card payments coming soon
                      </p>

                    </div>

                  </button>

                  {/* MPESA */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('mpesa')
                    }
                    className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                      paymentMethod === 'mpesa'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >

                    <Wallet className="w-6 h-6 text-green-600" />

                    <div>

                      <p className="font-medium text-slate-900">
                        M-Pesa
                      </p>

                      <p className="text-sm text-slate-600">
                        Payment integration coming soon
                      </p>

                    </div>

                  </button>

                  {/* CASH */}
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethod('cash')
                    }
                    className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >

                    <Banknote className="w-6 h-6 text-amber-600" />

                    <div>

                      <p className="font-medium text-slate-900">
                        Cash
                      </p>

                      <p className="text-sm text-slate-600">
                        Pay at pickup
                      </p>

                    </div>

                  </button>

                </div>

                {/* M-Pesa phone field is retained visually,
                    but it is NOT sent to the backend yet. */}
                {paymentMethod === 'mpesa' && (
                  <div className="mt-5">

                    <label
                      htmlFor="customerPhone"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Your M-Pesa Phone Number
                    </label>

                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) =>
                        setCustomerPhone(e.target.value)
                      }
                      placeholder="e.g. 0712345678"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-xs text-slate-500 mt-2">
                      M-Pesa payment will be connected later.
                    </p>

                  </div>
                )}

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-1">

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Booking Details
                </h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Vehicle
                    </span>

                    <span className="font-medium text-slate-900">
                      {vehicle.name}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Pickup Date
                    </span>

                    <span className="font-medium text-slate-900">
                      {pickupDate || 'Not selected'}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Return Date
                    </span>

                    <span className="font-medium text-slate-900">
                      {returnDate || 'Not selected'}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Duration
                    </span>

                    <span className="font-medium text-slate-900">
                      {days} days
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Pickup
                    </span>

                    <span className="font-medium text-slate-900 text-right max-w-[55%]">
                      {pickupLocation || 'Not selected'}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Drop-off
                    </span>

                    <span className="font-medium text-slate-900 text-right max-w-[55%]">
                      {dropoffLocation || 'Not selected'}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Driving Option
                    </span>

                    <span className="font-medium text-slate-900">
                      {drivingOption === 'hire'
                        ? 'Hire a Driver'
                        : 'Self Drive'}
                    </span>

                  </div>

                  {selectedDriver && (
                    <div className="flex justify-between">

                      <span className="text-slate-600">
                        Driver
                      </span>

                      <span className="font-medium text-slate-900">
                        {selectedDriver.name}
                      </span>

                    </div>
                  )}

                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Payment Method
                    </span>

                    <span className="font-medium text-slate-900 capitalize">
                      {paymentMethod}
                    </span>

                  </div>

                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200">

                    <span>Total</span>

                    <span className="text-blue-600">
                      KES {totalPrice.toLocaleString()}
                    </span>

                  </div>

                </div>

                <button
                  type="submit"
                  className="btn-primary w-full mt-6"
                  disabled={processing}
                >
                  {processing
                    ? 'Creating Booking...'
                    : 'Confirm Booking'}
                </button>

              </div>

            </div>

          </form>

        </div>

      </section>

    </div>
  )
}

export default BookingPage