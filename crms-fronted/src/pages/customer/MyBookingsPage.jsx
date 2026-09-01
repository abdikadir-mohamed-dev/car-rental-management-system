import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  ArrowLeft,
  XCircle,
  Edit3,
  Printer,
  FileText,
  Shield,
} from 'lucide-react'

import {
  getBookings,
  cancelBooking,
  updateBooking,
} from '../../services/bookingService'

import { mapBooking } from '../../utils/apiMappers'
import toast from 'react-hot-toast'

function MyBookingsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('upcoming')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modify booking
  const [editingBooking, setEditingBooking] = useState(null)
  const [editPickup, setEditPickup] = useState('')
  const [editReturn, setEditReturn] = useState('')

  // Cancel booking
  const [cancellingBooking, setCancellingBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  // =========================
  // LOAD BOOKINGS
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getBookings()

        const bookingList = Array.isArray(response)
          ? response
          : response?.bookings || []

        setBookings(bookingList.map(mapBooking))
      } catch (err) {
        console.error('Failed to load bookings:', err)

        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load bookings'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // =========================
  // FILTER BOOKINGS
  // =========================

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'upcoming') {
      return (
        booking.status === 'pending' ||
        booking.status === 'confirmed'
      )
    }

    return booking.status === activeTab
  })

  const selectedBooking = id
    ? bookings.find(
        (booking) =>
          String(booking.id) === String(id)
      )
    : null

  // =========================
  // OPEN CANCEL MODAL
  // =========================

  const handleOpenCancel = (booking) => {
    setCancellingBooking(booking)
    setCancelReason('')
  }

  // =========================
  // CLOSE CANCEL MODAL
  // =========================

  const handleCloseCancel = () => {
    if (cancelling) return

    setCancellingBooking(null)
    setCancelReason('')
  }

  // =========================
  // CONFIRM CANCELLATION
  // =========================

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return

    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }

    try {
      setCancelling(true)

      await cancelBooking(
        cancellingBooking.id,
        cancelReason.trim()
      )

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          String(booking.id) ===
          String(cancellingBooking.id)
            ? {
                ...booking,
                status: 'cancelled',
                cancellationReason:
                  cancelReason.trim(),
              }
            : booking
        )
      )

      toast.success('Booking cancelled successfully')

      setCancellingBooking(null)
      setCancelReason('')

      // If viewing a specific booking, go back to bookings
      if (id) {
        navigate('/customer/my-bookings')
      }
    } catch (err) {
      console.error(
        'Cancel booking error:',
        err
      )

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Failed to cancel booking'
      )
    } finally {
      setCancelling(false)
    }
  }

  // =========================
  // OPEN MODIFY MODAL
  // =========================

  const handleModify = (booking) => {
    setEditingBooking(booking)

    setEditPickup(
      booking.pickupDate
        ? booking.pickupDate.substring(0, 10)
        : ''
    )

    setEditReturn(
      booking.returnDate
        ? booking.returnDate.substring(0, 10)
        : ''
    )
  }

  // =========================
  // SAVE MODIFIED BOOKING
  // =========================

  const handleSaveModify = async () => {
    if (!editPickup || !editReturn) {
      toast.error('Please select both dates')
      return
    }

    if (
      new Date(editReturn) <=
      new Date(editPickup)
    ) {
      toast.error(
        'Return date must be after pickup date'
      )
      return
    }

    if (!editingBooking) return

    try {
      const days = Math.max(
        1,
        Math.ceil(
          (
            new Date(editReturn) -
            new Date(editPickup)
          ) /
            (1000 * 60 * 60 * 24)
        )
      )

      const updated = await updateBooking(
        editingBooking.id,
        {
          pickupDate: editPickup,
          returnDate: editReturn,
          dropoffDate: editReturn,
        }
      )

      const updatedBooking = mapBooking(
        updated?.booking || updated
      )

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          String(booking.id) ===
          String(editingBooking.id)
            ? {
                ...booking,
                ...updatedBooking,
                pickupDate: editPickup,
                returnDate: editReturn,
                dropoffDate: editReturn,
                duration: days,
              }
            : booking
        )
      )

      toast.success(
        'Booking updated successfully'
      )

      setEditingBooking(null)
    } catch (err) {
      console.error(
        'Update booking error:',
        err
      )

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Failed to update booking'
      )
    }
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
        <p className="text-slate-500">
          {error}
        </p>
      </div>
    )
  }

  // =========================
  // BOOKING DETAILS
  // =========================

  if (selectedBooking) {
    const vehicle = selectedBooking.vehicle

    const canCancel =
      selectedBooking.status === 'pending' ||
      selectedBooking.status === 'confirmed' ||
      selectedBooking.status === 'active'

    const canModify =
      selectedBooking.status === 'pending' ||
      selectedBooking.status === 'confirmed'

    const totalPrice =
      Number(
        selectedBooking.totalPrice || 0
      )

    const vehiclePrice =
      Number(
        selectedBooking.vehiclePrice ||
        vehicle?.pricePerDay ||
        0
      )

    const duration =
      Number(
        selectedBooking.duration || 1
      )

    return (
      <div>
        {/* BACK */}
        <button
          onClick={() =>
            navigate('/customer/my-bookings')
          }
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Bookings
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Booking Details
        </h1>

        <p className="text-slate-600 mb-6">
          Booking #{selectedBooking.id}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* VEHICLE */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Vehicle Information
              </h2>

              <div className="flex gap-4">
                {vehicle?.image ? (
                  <img
                    src={vehicle.image}
                    alt={
                      vehicle?.name ||
                      'Vehicle'
                    }
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 text-sm">
                      No image
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {vehicle?.name ||
                      'Vehicle'}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {vehicle?.category ||
                      'Vehicle'}

                    {vehicle?.brand
                      ? ` · ${vehicle.brand}`
                      : ''}
                  </p>

                  <p className="text-sm text-slate-600">
                    {vehicle?.seats
                      ? `${vehicle.seats} seats`
                      : ''}

                    {vehicle?.transmission
                      ? ` · ${vehicle.transmission}`
                      : ''}

                    {vehicle?.fuelType
                      ? ` · ${vehicle.fuelType}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* RENTAL */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Rental Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-slate-500">
                    Pickup Date
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedBooking.pickupDate ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Return Date
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedBooking.returnDate ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Pickup Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedBooking.pickupLocation ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Return Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedBooking.dropoffLocation ||
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Duration
                  </p>

                  <p className="font-medium text-slate-900">
                    {duration} Days
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Driving Option
                  </p>

                  <p className="font-medium text-slate-900">
                    {selectedBooking.drivingOption ===
                    'hire'
                      ? 'Hire a Driver'
                      : 'Self Drive'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <p className="font-medium text-slate-900 capitalize">
                    {selectedBooking.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Payment Status
                  </p>

                  <p className="font-medium text-slate-900 capitalize">
                    {selectedBooking.paymentStatus ||
                      'pending'}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* PAYMENT */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Payment Summary
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Vehicle ({duration} days)
                  </span>

                  <span className="font-medium text-slate-900">
                    KES{' '}
                    {(
                      vehiclePrice *
                      duration
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200">
                  <span>Total</span>

                  <span className="text-blue-600">
                    KES{' '}
                    {totalPrice.toLocaleString()}
                  </span>
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Actions
              </h3>

              <div className="space-y-2">

                {canCancel && (
                  <button
                    onClick={() =>
                      handleOpenCancel(
                        selectedBooking
                      )
                    }
                    className="btn-danger w-full flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </button>
                )}

                {canModify && (
                  <button
                    onClick={() =>
                      handleModify(
                        selectedBooking
                      )
                    }
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modify Booking
                  </button>
                )}

                <Link
                  to={`/customer/agreements/${selectedBooking.id}`}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Agreement
                </Link>

                <button
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                  onClick={() =>
                    window.print()
                  }
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* MODIFY MODAL */}
        {editingBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">

              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Modify Booking
                </h2>

                <p className="text-sm text-slate-600">
                  Update your booking dates
                </p>
              </div>

              <div className="p-6 space-y-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Pick-up Date
                  </label>

                  <input
                    type="date"
                    value={editPickup}
                    onChange={(e) =>
                      setEditPickup(
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Return Date
                  </label>

                  <input
                    type="date"
                    value={editReturn}
                    onChange={(e) =>
                      setEditReturn(
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </div>

              </div>

              <div className="p-6 border-t border-slate-200 flex gap-3">

                <button
                  onClick={handleSaveModify}
                  className="btn-primary flex-1"
                >
                  Save Changes
                </button>

                <button
                  onClick={() =>
                    setEditingBooking(null)
                  }
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

              </div>
            </div>
          </div>
        )}

        {/* CANCEL MODAL */}
        {cancellingBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 z-[60]">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">

              {/* HEADER */}
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  Cancel Booking
                </h2>

                <p className="text-sm text-slate-600 mt-1">
                  Are you sure you want to cancel this booking?
                </p>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-5">

                {/* WARNING */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">

                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />

                  <div>
                    <p className="font-medium text-amber-900">
                      Cancellation Policy
                    </p>

                    <p className="text-sm text-amber-800 mt-1">
                      Cancelling this booking may incur a
                      cancellation fee of 10% of the booking amount.
                    </p>
                  </div>

                </div>

                {/* BOOKING */}
                <div className="bg-slate-50 rounded-lg p-4">

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      Vehicle
                    </span>

                    <span className="font-medium text-slate-900">
                      {cancellingBooking.vehicle?.name ||
                        'Vehicle'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      Booking Amount
                    </span>

                    <span className="font-medium text-slate-900">
                      KES{' '}
                      {Number(
                        cancellingBooking.totalPrice ||
                        cancellingBooking.totalAmount ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Cancellation Fee
                    </span>

                    <span className="font-medium text-red-600">
                      KES{' '}
                      {(
                        Number(
                          cancellingBooking.totalPrice ||
                          cancellingBooking.totalAmount ||
                          0
                        ) * 0.1
                      ).toLocaleString()}
                    </span>
                  </div>

                </div>

                {/* REASON */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for Cancellation
                  </label>

                  <textarea
                    value={cancelReason}
                    onChange={(e) =>
                      setCancelReason(
                        e.target.value
                      )
                    }
                    className="input w-full"
                    rows="4"
                    placeholder="Please tell us why you want to cancel this booking..."
                    disabled={cancelling}
                  />

                  <p className="text-xs text-slate-500 mt-1">
                    Please provide a reason before confirming cancellation.
                  </p>
                </div>

              </div>

              {/* FOOTER */}
              <div className="p-6 border-t border-slate-200 flex gap-3">

                <button
                  onClick={handleCloseCancel}
                  disabled={cancelling}
                  className="btn-secondary flex-1 disabled:opacity-50"
                >
                  Keep Booking
                </button>

                <button
                  onClick={handleConfirmCancel}
                  disabled={
                    cancelling ||
                    !cancelReason.trim()
                  }
                  className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling
                    ? 'Cancelling...'
                    : 'Confirm Cancellation'}
                </button>

              </div>

            </div>
          </div>
        )}
      </div>
    )
  }

  // =========================
  // MY BOOKINGS LIST
  // =========================

  return (
    <div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        My Bookings
      </h1>

      <p className="text-slate-600 mb-6">
        Manage your rentals
      </p>

      {/* TABS */}
      <div className="border-b border-slate-200 mb-6">

        <nav className="flex gap-4">

          {[
            {
              key: 'upcoming',
              label: 'Upcoming',
            },
            {
              key: 'active',
              label: 'Active',
            },
            {
              key: 'completed',
              label: 'Completed',
            },
            {
              key: 'cancelled',
              label: 'Cancelled',
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key)
              }
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}

        </nav>
      </div>

      {/* BOOKINGS */}
      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">

          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No {activeTab} bookings
          </h3>

          <p className="text-slate-600 mb-4">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming bookings."
              : `No ${activeTab} bookings yet.`}
          </p>

          <Link
            to="/customer/browse"
            className="btn-primary"
          >
            Browse Cars
          </Link>

        </div>
      ) : (
        <div className="space-y-4">

          {filteredBookings.map((booking) => {

            const vehicle = booking.vehicle

            const displayStatus =
              booking.status === 'pending' ||
              booking.status === 'confirmed'
                ? 'upcoming'
                : booking.status

            return (
              <div
                key={booking.id}
                className="card p-6"
              >

                <div className="flex flex-col md:flex-row gap-6">

                  {/* VEHICLE IMAGE */}
                  {vehicle?.image ? (
                    <img
                      src={vehicle.image}
                      alt={
                        vehicle?.name ||
                        'Vehicle'
                      }
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-slate-400">
                        No image
                      </span>
                    </div>
                  )}

                  <div className="flex-1">

                    <div className="flex items-start justify-between mb-2">

                      <div>

                        <h3 className="text-lg font-semibold text-slate-900">
                          {vehicle?.name ||
                            'Vehicle'}
                        </h3>

                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs rounded-full font-medium capitalize ${
                            displayStatus ===
                            'upcoming'
                              ? 'bg-blue-100 text-blue-700'
                              : displayStatus ===
                                'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : displayStatus ===
                                'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {displayStatus}
                        </span>

                      </div>

                      <p className="text-xl font-bold text-blue-600">
                        KES{' '}
                        {Number(
                          booking.totalPrice || 0
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="space-y-1 text-sm text-slate-600 mb-4">

                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />

                        {booking.pickupLocation ||
                          'Pickup location'}
                      </p>

                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />

                        {booking.pickupDate ||
                          '-'}{' '}
                        -{' '}
                        {booking.returnDate ||
                          '-'}
                      </p>

                      <p>
                        {booking.duration ||
                          1}{' '}
                        Days ·{' '}

                        {booking.drivingOption ===
                        'hire'
                          ? 'Hire a Driver'
                          : 'Self Drive'}
                      </p>

                      <p>
                        Payment:{' '}

                        <span className="capitalize">
                          {booking.paymentStatus ||
                            'pending'}
                        </span>
                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 flex-wrap">

                      <Link
                        to={`/customer/my-bookings/${booking.id}`}
                        className="btn-secondary text-sm"
                      >
                        View Details
                      </Link>

                      {(booking.status ===
                        'pending' ||
                        booking.status ===
                          'confirmed') && (
                        <>
                          <button
                            onClick={() =>
                              handleModify(
                                booking
                              )
                            }
                            className="btn-secondary text-sm flex items-center gap-1"
                          >
                            <Edit3 className="w-4 h-4" />
                            Modify
                          </button>

                          <button
                            onClick={() =>
                              handleOpenCancel(
                                booking
                              )
                            }
                            className="btn-danger text-sm"
                          >
                            Cancel Booking
                          </button>
                        </>
                      )}

                      {booking.status ===
                        'active' && (
                        <button
                          onClick={() =>
                            handleOpenCancel(
                              booking
                            )
                          }
                          className="btn-danger text-sm"
                        >
                          Cancel Booking
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              </div>
            )
          })}

        </div>
      )}

      {/* =========================
          MODIFY MODAL
      ========================= */}

      {editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">

            <div className="p-6 border-b border-slate-200">

              <h2 className="text-xl font-semibold text-slate-900">
                Modify Booking
              </h2>

              <p className="text-sm text-slate-600">
                Update your booking dates
              </p>

            </div>

            <div className="p-6 space-y-4">

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pick-up Date
                </label>

                <input
                  type="date"
                  value={editPickup}
                  onChange={(e) =>
                    setEditPickup(
                      e.target.value
                    )
                  }
                  className="input"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Return Date
                </label>

                <input
                  type="date"
                  value={editReturn}
                  onChange={(e) =>
                    setEditReturn(
                      e.target.value
                    )
                  }
                  className="input"
                />

              </div>

            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">

              <button
                onClick={handleSaveModify}
                className="btn-primary flex-1"
              >
                Save Changes
              </button>

              <button
                onClick={() =>
                  setEditingBooking(null)
                }
                className="btn-secondary flex-1"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          CANCEL MODAL
      ========================= */}

      {cancellingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 z-[60]">

          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">

            <div className="p-6 border-b border-slate-200">

              <h2 className="text-xl font-semibold text-slate-900">
                Cancel Booking
              </h2>

              <p className="text-sm text-slate-600 mt-1">
                Are you sure you want to cancel this booking?
              </p>

            </div>

            <div className="p-6 space-y-5">

              {/* WARNING */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">

                <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />

                <div>

                  <p className="font-medium text-amber-900">
                    Cancellation Policy
                  </p>

                  <p className="text-sm text-amber-800 mt-1">
                    Cancelling this booking may incur a
                    cancellation fee of 10% of the booking amount.
                  </p>

                </div>

              </div>

              {/* BOOKING SUMMARY */}
              <div className="bg-slate-50 rounded-lg p-4">

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-slate-600">
                    Vehicle
                  </span>

                  <span className="font-medium text-slate-900">
                    {cancellingBooking.vehicle?.name ||
                      'Vehicle'}
                  </span>

                </div>

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-slate-600">
                    Booking Amount
                  </span>

                  <span className="font-medium text-slate-900">
                    KES{' '}
                    {Number(
                      cancellingBooking.totalPrice ||
                      cancellingBooking.totalAmount ||
                      0
                    ).toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-600">
                    Cancellation Fee
                  </span>

                  <span className="font-medium text-red-600">
                    KES{' '}
                    {(
                      Number(
                        cancellingBooking.totalPrice ||
                        cancellingBooking.totalAmount ||
                        0
                      ) * 0.1
                    ).toLocaleString()}
                  </span>

                </div>

              </div>

              {/* REASON */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Cancellation
                </label>

                <textarea
                  value={cancelReason}
                  onChange={(e) =>
                    setCancelReason(
                      e.target.value
                    )
                  }
                  className="input w-full"
                  rows="4"
                  placeholder="Please tell us why you want to cancel this booking..."
                  disabled={cancelling}
                />

                <p className="text-xs text-slate-500 mt-1">
                  A reason is required before cancellation.
                </p>

              </div>

            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-slate-200 flex gap-3">

              <button
                onClick={handleCloseCancel}
                disabled={cancelling}
                className="btn-secondary flex-1 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                onClick={handleConfirmCancel}
                disabled={
                  cancelling ||
                  !cancelReason.trim()
                }
                className="btn-danger flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling
                  ? 'Cancelling...'
                  : 'Confirm Cancellation'}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default MyBookingsPage