import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooking } from '../../redux/slices/bookingSlice'
import {
  ArrowLeft,
  Printer,
  Download,
  Car,
  User,
  FileText,
  Shield,
  CheckCircle,
} from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'

function RentalAgreementPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentBooking, loading } = useSelector((state) => state.bookings)

  useEffect(() => {
    if (id) {
      dispatch(fetchBooking(id))
    }
  }, [dispatch, id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    window.print()
  }

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
  const customer = currentBooking.customer || currentBooking.user || {}
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customer/bookings" className="p-2 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Rental Agreement</h1>
            <p className="text-slate-600 mt-1">Ref: #{currentBooking._id?.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="card p-8 space-y-8 print:shadow-none print:border-0">
        <div className="text-center border-b border-slate-200 pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="w-10 h-10 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">DriveGo</h2>
          </div>
          <p className="text-slate-600">Car Rental Management System</p>
          <p className="text-sm text-slate-500 mt-1">123 Main Street, Nairobi, Kenya</p>
          <p className="text-sm text-slate-500">+254 700 123 456 | info@drivego.com</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Rental Agreement</h3>
            <p className="text-sm text-slate-500">Agreement Date: {today}</p>
          </div>
          <StatusBadge status={currentBooking.status} type={currentBooking.status === 'confirmed' ? 'success' : currentBooking.status === 'pending' ? 'warning' : currentBooking.status === 'cancelled' ? 'danger' : 'info'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Customer Details
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-500">Full Name</p>
                <p className="font-medium text-slate-900">{customer.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{customer.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{customer.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Driver's License</p>
                <p className="font-medium text-slate-900">{customer.driversLicense || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">License Expiry</p>
                <p className="font-medium text-slate-900">{customer.licenseExpiry ? formatDateUtil(customer.licenseExpiry) : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-primary" />
              Vehicle Details
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-500">Vehicle</p>
                <p className="font-medium text-slate-900">{vehicle.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Registration</p>
                <p className="font-medium text-slate-900">{vehicle.registrationNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="font-medium text-slate-900 capitalize">{vehicle.type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Transmission</p>
                <p className="font-medium text-slate-900 capitalize">{vehicle.transmission || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500">Fuel Type</p>
                <p className="font-medium text-slate-900 capitalize">{vehicle.fuelType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Rental Period
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Pickup Date & Time</p>
              <p className="font-medium text-slate-900">{formatDateUtil(currentBooking.pickupDate)} at 10:00 AM</p>
            </div>
            <div>
              <p className="text-slate-500">Dropoff Date & Time</p>
              <p className="font-medium text-slate-900">{formatDateUtil(currentBooking.dropoffDate)} at 10:00 AM</p>
            </div>
            <div>
              <p className="text-slate-500">Pickup Location</p>
              <p className="font-medium text-slate-900">{currentBooking.pickupLocation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500">Dropoff Location</p>
              <p className="font-medium text-slate-900">{currentBooking.dropoffLocation || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Pricing Details
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Daily Rate</span>
              <span className="font-medium">{formatCurrency(vehicle.pricePerDay || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Rental Days</span>
              <span className="font-medium">{Math.ceil((new Date(currentBooking.dropoffDate) - new Date(currentBooking.pickupDate)) / (1000 * 60 * 60 * 24)) || 1} day(s)</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="font-bold text-primary text-lg">{formatCurrency(currentBooking.totalAmount || 0)}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Terms and Conditions
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>The vehicle must be returned in the same condition as received, with full fuel tank.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>A valid driver's license and ID must be presented at pickup.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Cancellation made 48 hours before pickup is eligible for full refund.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Smoking and off-road driving are strictly prohibited.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Late returns will incur additional charges at the daily rate.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>DriveGo is not liable for personal belongings left in the vehicle.</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Agreement Reference</p>
              <p className="font-mono text-sm text-slate-900">#{currentBooking._id?.slice(-16).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Total Amount Paid</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(currentBooking.totalAmount || 0)}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-slate-500 mb-6">Customer Signature</p>
                <div className="border-b border-slate-300 w-full" style={{ height: '40px' }} />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-6">DriveGo Representative</p>
                <div className="border-b border-slate-300 w-full" style={{ height: '40px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalAgreementPage
