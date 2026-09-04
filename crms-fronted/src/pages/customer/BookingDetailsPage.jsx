import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooking, updateBooking, cancelBooking } from '../../redux/slices/bookingSlice'
import {
  ArrowLeft,
  Car,
  Calendar,
  CreditCard,
  User,
  FileText,
  Printer,
  Edit,
  XCircle,
  Shield,
} from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { BOOKING_STATUS, PAYMENT_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import PaymentRetryModal from '../../components/payment/PaymentRetryModal'
import LocationMap from '../../components/common/LocationMap'
import { geocodeLocation } from '../../utils/geocode'
import toast from 'react-hot-toast'

function BookingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentBooking, loading } = useSelector((state) => state.bookings)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [showRetryModal, setShowRetryModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [modifyData, setModifyData] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchBooking(id))
    }
  }, [dispatch, id])

  const openModifyModal = () => {
    if (currentBooking) {
      setModifyData({
        pickupDate: currentBooking.pickupDate || '',
        dropoffDate: currentBooking.dropoffDate || '',
        pickupLocation: currentBooking.pickupLocation || '',
        dropoffLocation: currentBooking.dropoffLocation || '',
      })
    }
    setShowModifyModal(true)
  }

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    dispatch(cancelBooking(id))
      .unwrap()
      .then(() => {
        toast.success('Booking cancelled successfully')
        setShowCancelModal(false)
        navigate('/customer/bookings')
      })
      .catch((err) => toast.error(err))
  }

  const handleModify = () => {
    dispatch(updateBooking({ id, bookingData: modifyData }))
      .unwrap()
      .then(() => {
        toast.success('Booking updated successfully')
        setShowModifyModal(false)
      })
      .catch((err) => toast.error(err))
  }

  const [routeMarkers, setRouteMarkers] = useState([])

  useEffect(() => {
    const pickup = currentBooking?.pickupLocation
    const dropoff = currentBooking?.dropoffLocation
    let cancelled = false

    if (!pickup && !dropoff) {
      queueMicrotask(() => {
        if (!cancelled) setRouteMarkers([])
      })
      return () => {
        cancelled = true
      }
    }

    const loadMarkers = async () => {
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
    }

    loadMarkers()

    return () => {
      cancelled = true
    }
  }, [currentBooking?.pickupLocation, currentBooking?.dropoffLocation])

  if (loading) return <Loader />

  if (!currentBooking) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Booking not found</p>
        <Link to="/customer/bookings" className="btn-primary mt-4 inline-block">Back to Bookings</Link>
      </div>
    )
  }

  const vehicle = currentBooking.vehicle || {}
  const totalDays = currentBooking.pickupDate && currentBooking.dropoffDate
    ? Math.ceil((new Date(currentBooking.dropoffDate) - new Date(currentBooking.pickupDate)) / (1000 * 60 * 60 * 24))
    : 0
  const cancellationFee = totalDays > 0 ? (currentBooking.totalAmount || 0) * 0.1 : 0
  const refundAmount = (currentBooking.totalAmount || 0) - cancellationFee
  const canCancel = currentBooking.status === BOOKING_STATUS.PENDING || currentBooking.status === BOOKING_STATUS.CONFIRMED
  const canModify = currentBooking.status === BOOKING_STATUS.PENDING || currentBooking.status === BOOKING_STATUS.CONFIRMED

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customer/bookings" className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Booking Details</h1>
            <p className="text-slate-600 mt-1">Ref: #{currentBooking._id?.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={currentBooking.status} type={currentBooking.status === 'confirmed' ? 'success' : currentBooking.status === 'pending' ? 'warning' : currentBooking.status === 'cancelled' ? 'danger' : 'info'} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Vehicle Name</p>
                <p className="font-medium text-slate-900">{vehicle.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Type</p>
                <p className="font-medium text-slate-900 capitalize">{vehicle.type || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Brand</p>
                <p className="font-medium text-slate-900">{vehicle.brand || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Model</p>
                <p className="font-medium text-slate-900">{vehicle.model || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Year</p>
                <p className="font-medium text-slate-900">{vehicle.year || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Registration</p>
                <p className="font-medium text-slate-900">{vehicle.registrationNumber || '-'}</p>
              </div>
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">{feature}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Rental Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Pickup Date</p>
                <p className="font-medium text-slate-900">{formatDateUtil(currentBooking.pickupDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Dropoff Date</p>
                <p className="font-medium text-slate-900">{formatDateUtil(currentBooking.dropoffDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Pickup Location</p>
                <p className="font-medium text-slate-900">{currentBooking.pickupLocation || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Dropoff Location</p>
                <p className="font-medium text-slate-900">{currentBooking.dropoffLocation || '-'}</p>
              </div>
            </div>
            {routeMarkers.length > 0 && (
              <div className="mt-4">
                <LocationMap markers={routeMarkers} />
              </div>
            )}
          </div>

          {currentBooking.specialRequests && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Special Requests</h2>
              <p className="text-slate-600">{currentBooking.specialRequests}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium text-slate-900">{currentBooking.customer?.name || currentBooking.user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{currentBooking.customer?.email || currentBooking.user?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{currentBooking.customer?.phone || currentBooking.user?.phone || '-'}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Amount</span>
                <span className="font-bold text-primary">{formatCurrency(currentBooking.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <StatusBadge status={currentBooking.paymentStatus || PAYMENT_STATUS.PENDING} type={currentBooking.paymentStatus === PAYMENT_STATUS.COMPLETED ? 'success' : currentBooking.paymentStatus === PAYMENT_STATUS.FAILED ? 'danger' : 'warning'} />
              </div>
              {currentBooking.payment?.transactionId && (
                <div>
                  <p className="text-sm text-slate-500">Transaction ID</p>
                  <p className="font-mono text-sm text-slate-900">{currentBooking.payment.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Total Amount</h2>
            <p className="text-3xl font-bold text-primary mb-2">{formatCurrency(currentBooking.totalAmount || 0)}</p>
            {totalDays > 0 && (
              <p className="text-sm text-slate-500">{totalDays} day{totalDays !== 1 ? 's' : ''} x {formatCurrency(vehicle.pricePerDay || 0)}/day</p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions</h2>
            <div className="space-y-2">
              {canModify && (
                <button onClick={openModifyModal} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Modify Booking
                </button>
              )}
              {canCancel && (
                <button onClick={() => setShowCancelModal(true)} className="btn-danger w-full flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancel Booking
                </button>
              )}
              <Link to={`/customer/agreements/${currentBooking._id}`} className="btn-secondary w-full flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                View Agreement
              </Link>
              {currentBooking.paymentStatus === PAYMENT_STATUS.FAILED &&
                currentBooking.status !== BOOKING_STATUS.CANCELLED && (
                <button onClick={() => setShowRetryModal(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Retry Payment
                </button>
              )}
              {currentBooking.paymentStatus === PAYMENT_STATUS.COMPLETED && (
                <button className="btn-secondary w-full flex items-center justify-center gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModifyModal}
        onClose={() => setShowModifyModal(false)}
        title="Modify Booking"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowModifyModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleModify} className="btn-primary flex-1">Save Changes</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Pickup Date</label>
            <input type="date" name="pickupDate" value={modifyData.pickupDate} onChange={(e) => setModifyData({ ...modifyData, pickupDate: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Dropoff Date</label>
            <input type="date" name="dropoffDate" value={modifyData.dropoffDate} onChange={(e) => setModifyData({ ...modifyData, dropoffDate: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Pickup Location</label>
            <input type="text" name="pickupLocation" value={modifyData.pickupLocation} onChange={(e) => setModifyData({ ...modifyData, pickupLocation: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Dropoff Location</label>
            <input type="text" name="dropoffLocation" value={modifyData.dropoffLocation} onChange={(e) => setModifyData({ ...modifyData, dropoffLocation: e.target.value })} className="input" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(false)} className="btn-secondary flex-1">Keep Booking</button>
            <button onClick={handleCancel} className="btn-danger flex-1">Confirm Cancellation</button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-amber-50 p-4 rounded-lg">
            <Shield className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">Cancellation will incur a fee of 10% of the booking amount.</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Amount</span>
              <span className="font-medium">{formatCurrency(currentBooking.totalAmount || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cancellation Fee</span>
              <span className="font-medium text-danger">{formatCurrency(cancellationFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Refund Amount</span>
              <span className="font-bold text-success">{formatCurrency(refundAmount)}</span>
            </div>
          </div>
          <div>
            <label className="label">Reason for Cancellation</label>
            <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="input" rows="3" placeholder="Please provide a reason..." />
          </div>
        </div>
      </Modal>

      <PaymentRetryModal
        isOpen={showRetryModal}
        onClose={() => setShowRetryModal(false)}
        booking={currentBooking}
        onSuccess={() => dispatch(fetchBooking(id))}
      />
    </div>
  )
}

export default BookingDetailsPage
