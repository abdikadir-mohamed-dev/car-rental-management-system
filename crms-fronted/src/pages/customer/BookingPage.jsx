import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVehicle } from '../../redux/slices/vehicleSlice'
import { createBooking } from '../../redux/slices/bookingSlice'
import toast from 'react-hot-toast'
import Loader from '../../components/common/Loader'

function BookingPage() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentVehicle, loading, error } = useSelector((state) => state.vehicles)
  const [formData, setFormData] = useState({
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    specialRequests: '',
  })
  const { loading: bookingLoading } = useSelector((state) => state.bookings)

  useEffect(() => {
    if (!vehicleId) {
      toast.error('Invalid booking link')
      navigate('/customer/vehicles')
      return
    }
    dispatch(fetchVehicle(vehicleId))
  }, [dispatch, vehicleId, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createBooking({ ...formData, vehicleId }))
      .unwrap()
      .then(() => {
        toast.success('Booking created successfully!')
        setFormData({
          pickupDate: '',
          dropoffDate: '',
          pickupLocation: '',
          dropoffLocation: '',
          specialRequests: '',
        })
        navigate('/customer/bookings')
      })
      .catch((err) => toast.error(err))
  }

  if (loading) return <Loader />

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger text-lg mb-4">Failed to load vehicle details</p>
        <button onClick={() => dispatch(fetchVehicle(vehicleId))} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  if (!currentVehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Vehicle not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Book Vehicle</h1>
        <p className="text-slate-600 mt-1">Complete your booking for {currentVehicle?.name}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Pickup Date</label>
                <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="label">Dropoff Date</label>
                <input type="date" name="dropoffDate" value={formData.dropoffDate} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="label">Pickup Location</label>
                <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className="input" required />
              </div>
              <div>
                <label className="label">Dropoff Location</label>
                <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className="input" required />
              </div>
            </div>
            <div>
              <label className="label">Special Requests</label>
              <textarea name="specialRequests" rows="3" value={formData.specialRequests} onChange={handleChange} className="input" />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={bookingLoading}>
              {bookingLoading ? 'Creating Booking...' : 'Create Booking'}
            </button>
          </form>
        </div>
        <div>
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>
            {currentVehicle && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{currentVehicle.name}</p>
                    <p className="text-sm text-slate-500">{currentVehicle.type}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per day</span>
                    <span>${currentVehicle.pricePerDay}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
