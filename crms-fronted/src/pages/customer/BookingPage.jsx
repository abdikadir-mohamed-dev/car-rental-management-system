import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Wallet, Banknote } from 'lucide-react'
import { mockVehicles } from '../../data/mockData'
import { mockDrivers } from '../../data/mockDrivers'
import toast from 'react-hot-toast'

function BookingPage() {
  const { vehicleId } = useParams()
  const vehicle = mockVehicles.find(v => v.id === Number(vehicleId))
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [drivingOption, setDrivingOption] = useState('self')
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pickup = params.get('pickup')
    const returnD = params.get('return')
    const option = params.get('option')
    const driverId = params.get('driver')
    if (pickup) setPickupDate(pickup)
    if (returnD) setReturnDate(returnD)
    if (option) setDrivingOption(option)
    if (driverId) {
      const driver = mockDrivers.find(d => d.id === Number(driverId))
      setSelectedDriver(driver)
    }
  }, [vehicleId])

  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)))
    : 1
  const vehicleCost = days * vehicle?.pricePerDay
  const driverCost = drivingOption === 'hire' && selectedDriver ? days * selectedDriver.pricePerDay : 0
  const totalPrice = vehicleCost + driverCost

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!pickupDate || !returnDate) {
      toast.error('Please select dates')
      return
    }
    setProcessing(true)
    setTimeout(() => {
      const newBookingId = `DG-${10000 + Math.floor(Math.random() * 90000)}`
      setBookingId(newBookingId)
      setConfirmed(true)
      setProcessing(false)
      toast.success('Booking confirmed!')
    }, 1500)
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Not Found</h1>
          <Link to="/customer/browse" className="text-blue-600 hover:text-blue-700 font-medium">Back to Browse</Link>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-6">Your {vehicle.name} has been successfully booked.</p>
          <div className="card p-6 text-left space-y-2 mb-6">
            <p><span className="text-slate-600">Booking ID:</span> <span className="font-medium text-slate-900">#{bookingId}</span></p>
            <p><span className="text-slate-600">Vehicle:</span> <span className="font-medium text-slate-900">{vehicle.name}</span></p>
            <p><span className="text-slate-600">Pickup:</span> <span className="font-medium text-slate-900">{pickupDate}</span></p>
            <p><span className="text-slate-600">Return:</span> <span className="font-medium text-slate-900">{returnDate}</span></p>
            <p><span className="text-slate-600">Driving Option:</span> <span className="font-medium text-slate-900 capitalize">{drivingOption === 'hire' ? 'Hire a Driver' : 'Self Drive'}</span></p>
            {selectedDriver && (
              <p><span className="text-slate-600">Driver:</span> <span className="font-medium text-slate-900">{selectedDriver.name}</span></p>
            )}
            <p><span className="text-slate-600">Total:</span> <span className="font-bold text-blue-600 text-lg">KES {totalPrice.toLocaleString()}</span></p>
          </div>
          <div className="flex gap-3">
            <Link to="/customer/my-bookings" className="btn-primary flex-1">View Booking</Link>
            <Link to="/customer" className="btn-secondary flex-1">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/customer/vehicles/${vehicle.id}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicle
          </Link>
          <h1 className="text-3xl font-bold">Complete Your Booking</h1>
          <p className="text-slate-300">Review and confirm your rental</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Booking Summary</h2>
                <div className="flex gap-4 mb-4">
                  <img src={vehicle.image} alt={vehicle.name} className="w-32 h-24 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{vehicle.name}</h3>
                    <p className="text-sm text-slate-600">{vehicle.category} · {vehicle.location}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">KES {vehicle.pricePerDay}/day</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle ({days} day{days > 1 ? 's' : ''})</span>
                    <span className="font-medium text-slate-900">KES {vehicleCost.toLocaleString()}</span>
                  </div>
                  {drivingOption === 'hire' && selectedDriver && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Driver ({days} day{days > 1 ? 's' : ''})</span>
                      <span className="font-medium text-slate-900">KES {driverCost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-blue-600">KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                      paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">Card</p>
                      <p className="text-sm text-slate-600">Pay with credit or debit card</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                      paymentMethod === 'mpesa' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Wallet className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">M-Pesa</p>
                      <p className="text-sm text-slate-600">Pay with M-Pesa</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                      paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="font-medium text-slate-900">Cash</p>
                      <p className="text-sm text-slate-600">Pay at pickup</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">Booking Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle</span>
                    <span className="font-medium text-slate-900">{vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pickup Date</span>
                    <span className="font-medium text-slate-900">{pickupDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Return Date</span>
                    <span className="font-medium text-slate-900">{returnDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-medium text-slate-900">{days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Driving Option</span>
                    <span className="font-medium text-slate-900 capitalize">{drivingOption === 'hire' ? 'Hire a Driver' : 'Self Drive'}</span>
                  </div>
                  {selectedDriver && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Driver</span>
                      <span className="font-medium text-slate-900">{selectedDriver.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-medium text-slate-900 capitalize">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-blue-600">KES {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full mt-6" disabled={processing}>
                  {processing ? 'Processing...' : 'Confirm Booking'}
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
