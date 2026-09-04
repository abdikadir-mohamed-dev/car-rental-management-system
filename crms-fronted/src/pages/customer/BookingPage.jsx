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
import { createBooking } from '../../services/bookingService'
import { createPayment } from '../../services/paymentService'
import { mapVehicle } from '../../utils/apiMappers'
import LocationMap from '../../components/common/LocationMap'
import { geocodeLocation } from '../../utils/geocode'

import toast from 'react-hot-toast'

function BookingPage() {
  const { vehicleId } = useParams()

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')

  /*
   * Customer chooses only:
   *
   * self = customer drives
   * hire = customer requests a driver
   *
   * Customer DOES NOT select a driver.
   * Staff will assign an available driver later.
   */
  const [drivingOption, setDrivingOption] = useState('self')

  /*
   * PAYMENT
   *
   * card  = coming soon
   * mpesa = M-Pesa STK Push
   * cash  = pay at pickup
   */
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [customerPhone, setCustomerPhone] = useState('')

  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

  /*
   * LOAD VEHICLE
   */
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setLoading(true)
        setError(null)

        const vehicleData = await getVehicle(vehicleId)

        const mappedVehicle = mapVehicle(vehicleData)

        setVehicle(mappedVehicle)

        /*
         * Use vehicle location as the default
         * pickup and drop-off location.
         */
        if (mappedVehicle?.location) {
          setPickupLocation(mappedVehicle.location)
          setDropoffLocation(mappedVehicle.location)
        }
      } catch (err) {
        console.error(
          'Failed to load booking data:',
          err
        )

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load vehicle data'
        )
      } finally {
        setLoading(false)
      }
    }

    if (vehicleId) {
      loadVehicle()
    }
  }, [vehicleId])

  /*
   * READ BOOKING INFORMATION FROM URL
   *
   * VehicleDetailsPage sends:
   *
   * ?pickup=2026-09-03
   * &return=2026-09-04
   * &option=hire
   *
   * There is NO driver ID anymore.
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    )

    const pickup = params.get('pickup')
    const returnD = params.get('return')
    const option = params.get('option')

    if (pickup) {
      setPickupDate(pickup)
    }

    if (returnD) {
      setReturnDate(returnD)
    }

    if (option === 'hire') {
      setDrivingOption('hire')
    } else {
      setDrivingOption('self')
    }
  }, [])

  /*
   * CALCULATE RENTAL DAYS
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
   * VEHICLE COST
   */
  const vehicleCost =
    days * (vehicle?.pricePerDay || 0)

  /*
   * DRIVER COST
   *
   * Customer does not select a driver.
   *
   * If the backend/rental policy has a fixed
   * driver charge, it can be added here later.
   */
  const driverCost = 0

  /*
   * TOTAL
   */
  const totalPrice =
    vehicleCost + driverCost

  /*
   * SUBMIT BOOKING
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    /*
     * Validate dates
     */
    if (!pickupDate || !returnDate) {
      toast.error(
        'Please select pickup and return dates'
      )
      return
    }

    /*
     * Pickup date cannot be in the past
     */
    const today = new Date().toISOString().split('T')[0]

    if (pickupDate < today) {
      toast.error(
        'Pickup date cannot be in the past'
      )
      return
    }

    /*
     * Return date must be after pickup date
     */
    if (
      new Date(returnDate) <=
      new Date(pickupDate)
    ) {
      toast.error(
        'Return date must be after pickup date'
      )
      return
    }

    /*
     * Validate pickup location
     */
    if (!pickupLocation.trim()) {
      toast.error(
        'Please enter a pickup location'
      )
      return
    }

    /*
     * Validate drop-off location
     */
    if (!dropoffLocation.trim()) {
      toast.error(
        'Please enter a drop-off location'
      )
      return
    }

    /*
     * M-Pesa requires a phone number
     */
    if (
      paymentMethod === 'mpesa' &&
      !customerPhone.trim()
    ) {
      toast.error(
        'Please enter your M-Pesa phone number'
      )
      return
    }

    /*
     * Card is not implemented yet
     */
    if (paymentMethod === 'card') {
      toast.error(
        'Card payments are coming soon. Please choose M-Pesa or Cash.'
      )
      return
    }

    setProcessing(true)

    try {
      /*
       * Backend driving option:
       *
       * self
       * with_driver
       */
      const backendDrivingOption =
        drivingOption === 'hire'
          ? 'with_driver'
          : 'self'

      /*
       * BOOKING PAYLOAD
       *
       * driverId is NOT selected by customer.
       * Staff assigns a driver later.
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

        driverId: null,
      }

      console.log(
        'Creating booking:',
        bookingData
      )

      /*
       * -----------------------------------------
       * STEP 1
       * CREATE REAL BOOKING
       * -----------------------------------------
       */
      const booking =
        await createBooking(bookingData)

      console.log(
        'Booking created successfully:',
        booking
      )

      /*
       * GET BOOKING ID
       */
      const createdBookingId =
        booking?.id ||
        booking?._id

      if (!createdBookingId) {
        throw new Error(
          'Booking was created but no booking ID was returned.'
        )
      }

      /*
       /*
 * -----------------------------------------
 * STEP 2
 * CREATE PAYMENT
 * -----------------------------------------
 *
 * CASH:
 * Creates a pending cash payment.
 * Staff receives and confirms the cash at checkout.
 *
 * M-PESA:
 * Creates a pending payment and sends
 * an STK Push through Safaricom.
 *
 * M-Pesa becomes completed ONLY after
 * the Safaricom callback.
 */

if (paymentMethod === 'mpesa') {
  console.log(
    'Initiating M-Pesa payment...',
    {
      bookingId: createdBookingId,
      amount: Math.round(totalPrice),
      phoneNumber: customerPhone.trim(),
    }
  )

  toast.loading(
    'Sending M-Pesa prompt...',
    {
      id: 'mpesa-payment',
    }
  )

  const payment = await createPayment({
    bookingId: createdBookingId,
    amount: Math.round(totalPrice),
    phoneNumber: customerPhone.trim(),
    method: 'mpesa',
  })

  console.log(
    'M-Pesa payment initiated:',
    payment
  )

  toast.success(
    'M-Pesa prompt sent to your phone. Enter your PIN to complete the payment.',
    {
      id: 'mpesa-payment',
      duration: 6000,
    }
  )
}

if (paymentMethod === 'cash') {
  console.log(
    'Creating pending cash payment...',
    {
      bookingId: createdBookingId,
      amount: Math.round(totalPrice),
    }
  )

  const payment = await createPayment({
    bookingId: createdBookingId,
    amount: Math.round(totalPrice),
    method: 'cash',
  })

  console.log(
    'Cash payment created:',
    payment
  )

  toast.success(
    'Booking submitted. Cash payment will be confirmed when you pay at pickup.'
  )
}

      /*
       * -----------------------------------------
       * STEP 3
       * SAVE BOOKING ID
       * -----------------------------------------
       */
      setBookingId(
        String(createdBookingId)
      )

      /*
       * -----------------------------------------
       * STEP 4
       * SHOW CONFIRMATION
       * -----------------------------------------
       */
      setConfirmed(true)

      /*
       * Different confirmation message
       * depending on payment method.
       */
      if (paymentMethod === 'mpesa') {
        toast.success(
          'Booking submitted. Check your phone for the M-Pesa prompt.'
        )
      } else if (paymentMethod === 'cash') {
        toast.success(
          'Booking submitted successfully!'
        )
      }
    } catch (err) {
      console.error(
        'Booking/payment error:',
        err
      )

      toast.dismiss('mpesa-payment')

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to create booking or payment'

      toast.error(message)
    } finally {
      setProcessing(false)
    }
  }

  const [routeMarkers, setRouteMarkers] = useState([])

  /*
   * Geocode pickup/drop-off after the user stops typing, rather than
   * on every keystroke, since these are free-text inputs.
   */
  useEffect(() => {
    const pickup = pickupLocation.trim()
    const dropoff = dropoffLocation.trim()
    let cancelled = false

    if (!pickup && !dropoff) {
      queueMicrotask(() => {
        if (!cancelled) setRouteMarkers([])
      })
      return () => {
        cancelled = true
      }
    }

    const timeoutId = setTimeout(async () => {
      const markers = pickup && dropoff
        ? await Promise.all([
            geocodeLocation(pickup).then((position) => ({ position, label: `Pickup: ${pickup}` })),
            geocodeLocation(dropoff).then((position) => ({ position, label: `Drop-off: ${dropoff}` })),
          ])
        : [
            {
              position: await geocodeLocation(pickup || dropoff),
              label: pickup || dropoff,
            },
          ]

      if (!cancelled) {
        setRouteMarkers(markers)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [pickupLocation, dropoffLocation])

  /*
   * LOADING
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  /*
   * ERROR
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
   * BOOKING CONFIRMATION
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

          {paymentMethod === 'mpesa' ? (
            <p className="text-slate-600 mb-6">
              Your booking has been submitted. Check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
            </p>
          ) : (
            <p className="text-slate-600 mb-6">
              Your booking for {vehicle.name} has been submitted and is awaiting confirmation.
            </p>
          )}

          <div className="card p-6 text-left space-y-3 mb-6">

            {/* BOOKING ID */}
            <p>
              <span className="text-slate-600">
                Booking ID:
              </span>{' '}

              <span className="font-medium text-slate-900">
                #{bookingId}
              </span>
            </p>

            {/* VEHICLE */}
            <p>
              <span className="text-slate-600">
                Vehicle:
              </span>{' '}

              <span className="font-medium text-slate-900">
                {vehicle.name}
              </span>
            </p>

            {/* PICKUP DATE */}
            <p>
              <span className="text-slate-600">
                Pickup:
              </span>{' '}

              <span className="font-medium text-slate-900">
                {pickupDate}
              </span>
            </p>

            {/* RETURN DATE */}
            <p>
              <span className="text-slate-600">
                Return:
              </span>{' '}

              <span className="font-medium text-slate-900">
                {returnDate}
              </span>
            </p>

            {/* PICKUP LOCATION */}
            <p>
              <span className="text-slate-600">
                Pickup Location:
              </span>{' '}

              <span className="font-medium text-slate-900">
                {pickupLocation}
              </span>
            </p>

            {/* DROP-OFF LOCATION */}
            <p>
              <span className="text-slate-600">
                Drop-off Location:
              </span>{' '}

              <span className="font-medium text-slate-900">
                {dropoffLocation}
              </span>
            </p>

            {/* DRIVING OPTION */}
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

            {/* DRIVER STATUS */}
            {drivingOption === 'hire' && (
              <p>
                <span className="text-slate-600">
                  Driver:
                </span>{' '}

                <span className="font-medium text-amber-600">
                  To be assigned by staff
                </span>
              </p>
            )}

            {/* PAYMENT */}
            <p>
              <span className="text-slate-600">
                Payment:
              </span>{' '}

              <span
                className={`font-medium ${
                  paymentMethod === 'mpesa'
                    ? 'text-amber-600'
                    : 'text-amber-600'
                }`}
              >
                Pending
              </span>
            </p>

            {/* PAYMENT METHOD */}
            <p>
              <span className="text-slate-600">
                Payment Method:
              </span>{' '}

              <span className="font-medium text-slate-900 capitalize">
                {paymentMethod}
              </span>
            </p>

            {/* TOTAL */}
            <p>
              <span className="text-slate-600">
                Total:
              </span>{' '}

              <span className="font-bold text-blue-600 text-lg">
                KES {totalPrice.toLocaleString()}
              </span>
            </p>

          </div>

          {paymentMethod === 'mpesa' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-left">
              <p className="font-medium text-green-800">
                M-Pesa payment requested
              </p>

              <p className="text-sm text-green-700 mt-1">
                Check your phone and enter your M-Pesa PIN. Your payment will remain pending until Safaricom confirms the transaction.
              </p>
            </div>
          )}

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
   * MAIN BOOKING PAGE
   */
  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <section className="bg-slate-900 text-white py-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to={`/customer/vehicles/${vehicle.id}`}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicle
          </Link>

          <h1 className="text-3xl font-bold text-white">
            Complete Your Booking
          </h1>

          <p className="text-slate-300">
            Review and submit your rental
          </p>

        </div>

      </section>

      {/* BOOKING CONTENT */}
      <section className="py-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">

              {/* BOOKING SUMMARY */}
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

                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">

                    <span>
                      Total
                    </span>

                    <span className="text-blue-600">
                      KES {totalPrice.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* RENTAL LOCATIONS */}
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

                  {routeMarkers.length > 0 && (
                    <LocationMap markers={routeMarkers} />
                  )}

                </div>

              </div>

              {/* DRIVING OPTION */}
              <div className="card p-6">

                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Driving Option
                </h2>

                <div className="space-y-3">

                  {/* SELF DRIVE */}
                  <button
                    type="button"
                    onClick={() =>
                      setDrivingOption('self')
                    }
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      drivingOption === 'self'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >

                    <p className="font-medium text-slate-900">
                      Drive Myself
                    </p>

                    <p className="text-sm text-slate-600">
                      I will drive the vehicle myself
                    </p>

                  </button>

                  {/* HIRE DRIVER */}
                  <button
                    type="button"
                    onClick={() =>
                      setDrivingOption('hire')
                    }
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      drivingOption === 'hire'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >

                    <p className="font-medium text-slate-900">
                      Hire a Driver
                    </p>

                    <p className="text-sm text-slate-600">
                      Request a professional driver. Staff will assign an available driver to your booking.
                    </p>

                  </button>

                </div>

                {/* STAFF ASSIGNMENT MESSAGE */}
                {drivingOption === 'hire' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">

                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">
                        Driver assignment:
                      </span>{' '}
                      You don't need to choose a driver. Our staff will assign an available driver after reviewing your booking.
                    </p>

                  </div>
                )}

              </div>

              {/* PAYMENT METHOD */}
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
                        Pay securely using M-Pesa STK Push
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

                {/* MPESA PHONE */}
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
                      An M-Pesa STK prompt will be sent to this number.
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

                  {/* VEHICLE */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Vehicle
                    </span>

                    <span className="font-medium text-slate-900">
                      {vehicle.name}
                    </span>

                  </div>

                  {/* PICKUP DATE */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Pickup Date
                    </span>

                    <span className="font-medium text-slate-900">
                      {pickupDate || 'Not selected'}
                    </span>

                  </div>

                  {/* RETURN DATE */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Return Date
                    </span>

                    <span className="font-medium text-slate-900">
                      {returnDate || 'Not selected'}
                    </span>

                  </div>

                  {/* DURATION */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Duration
                    </span>

                    <span className="font-medium text-slate-900">
                      {days} days
                    </span>

                  </div>

                  {/* PICKUP */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Pickup
                    </span>

                    <span className="font-medium text-slate-900 text-right max-w-[55%]">
                      {pickupLocation || 'Not selected'}
                    </span>

                  </div>

                  {/* DROP-OFF */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Drop-off
                    </span>

                    <span className="font-medium text-slate-900 text-right max-w-[55%]">
                      {dropoffLocation || 'Not selected'}
                    </span>

                  </div>

                  {/* DRIVING OPTION */}
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

                  {/* DRIVER ASSIGNMENT */}
                  {drivingOption === 'hire' && (
                    <div className="flex justify-between">

                      <span className="text-slate-600">
                        Driver
                      </span>

                      <span className="font-medium text-amber-600 text-right max-w-[55%]">
                        To be assigned
                      </span>

                    </div>
                  )}

                  {/* PAYMENT METHOD */}
                  <div className="flex justify-between">

                    <span className="text-slate-600">
                      Payment Method
                    </span>

                    <span className="font-medium text-slate-900 capitalize">
                      {paymentMethod}
                    </span>

                  </div>

                  {/* TOTAL */}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200">

                    <span>
                      Total
                    </span>

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
                    ? paymentMethod === 'mpesa'
                      ? 'Sending M-Pesa Prompt...'
                      : 'Creating Booking...'
                    : paymentMethod === 'mpesa'
                      ? 'Pay with M-Pesa'
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