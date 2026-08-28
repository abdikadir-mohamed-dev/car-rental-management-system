import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBooking } from '../../redux/slices/bookingSlice'
import toast from 'react-hot-toast'
import { formatCurrency } from '../../utils/formatCurrency'

function BookingForm({ vehicle, onClose }) {
  const [formData, setFormData] = useState({
    vehicleId: vehicle._id,
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    specialRequests: '',
  })
  const [errors, setErrors] = useState({})
  const { loading } = useSelector((state) => state.bookings)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const calculateTotal = () => {
    if (!formData.pickupDate || !formData.dropoffDate) return 0
    const start = new Date(formData.pickupDate)
    const end = new Date(formData.dropoffDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return days > 0 ? days * vehicle.pricePerDay : 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required'
    if (!formData.dropoffDate) newErrors.dropoffDate = 'Dropoff date is required'
    if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required'
    if (!formData.dropoffLocation) newErrors.dropoffLocation = 'Dropoff location is required'
    if (new Date(formData.dropoffDate) <= new Date(formData.pickupDate)) {
      newErrors.dropoffDate = 'Dropoff must be after pickup'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(createBooking(formData))
      .unwrap()
      .then(() => {
        toast.success('Booking created successfully!')
        onClose?.()
      })
      .catch((err) => toast.error(err))
  }

  const total = calculateTotal()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Book {vehicle.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <span className="text-2xl text-slate-500">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Pickup Date</label>
              <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className={`input ${errors.pickupDate ? 'border-danger' : ''}`} />
              {errors.pickupDate && <p className="text-danger text-sm mt-1">{errors.pickupDate}</p>}
            </div>
            <div>
              <label className="label">Dropoff Date</label>
              <input type="date" name="dropoffDate" value={formData.dropoffDate} onChange={handleChange} className={`input ${errors.dropoffDate ? 'border-danger' : ''}`} />
              {errors.dropoffDate && <p className="text-danger text-sm mt-1">{errors.dropoffDate}</p>}
            </div>
            <div>
              <label className="label">Pickup Location</label>
              <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} className={`input ${errors.pickupLocation ? 'border-danger' : ''}`} />
              {errors.pickupLocation && <p className="text-danger text-sm mt-1">{errors.pickupLocation}</p>}
            </div>
            <div>
              <label className="label">Dropoff Location</label>
              <input type="text" name="dropoffLocation" value={formData.dropoffLocation} onChange={handleChange} className={`input ${errors.dropoffLocation ? 'border-danger' : ''}`} />
              {errors.dropoffLocation && <p className="text-danger text-sm mt-1">{errors.dropoffLocation}</p>}
            </div>
          </div>
          <div>
            <label className="label">Special Requests</label>
            <textarea name="specialRequests" rows="3" value={formData.specialRequests} onChange={handleChange} className="input" />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Price per day</span>
              <span className="font-medium">{formatCurrency(vehicle.pricePerDay)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Duration</span>
              <span className="font-medium">{total > 0 ? `${Math.ceil((new Date(formData.dropoffDate) - new Date(formData.pickupDate)) / (1000 * 60 * 60 * 24))} days` : '-'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={loading || total === 0}>
              {loading ? 'Creating...' : 'Confirm Booking'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
