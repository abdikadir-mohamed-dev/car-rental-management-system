import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createVehicle, updateVehicle } from '../../redux/slices/vehicleSlice'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { VEHICLE_TYPES } from '../../utils/constants'

function VehicleForm({ vehicle, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'sedan',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    pricePerDay: '',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    features: '',
    image: '',
    description: '',
    status: 'available',
    available: true,
  })

  const [errors, setErrors] = useState({})

  const { loading } = useSelector((state) => state.vehicles)
  const dispatch = useDispatch()
  const isEdit = !!vehicle

  const initialFormData = useMemo(() => ({
    name: vehicle?.name || '',
    type: vehicle?.type || 'sedan',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    pricePerDay: vehicle?.pricePerDay || '',
    seats: vehicle?.seats || 5,
    transmission: vehicle?.transmission || 'automatic',
    fuelType: vehicle?.fuelType || 'petrol',
    features: vehicle?.features?.join(', ') || '',
    image: vehicle?.image || '',
    description: vehicle?.description || '',
    status: vehicle?.status || 'available',
    available:
      vehicle?.available ??
      vehicle?.isAvailable ??
      true,
  }), [vehicle])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(initialFormData)
  }, [initialFormData])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // ============================================================
  // STATUS CHANGE
  // ============================================================

  const handleStatusChange = (e) => {
    const status = e.target.value

    let available = false

    if (status === 'available') {
      available = true
    }

    setFormData((prev) => ({
      ...prev,
      status,
      available,
    }))
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    if (!formData.brand) {
      newErrors.brand = 'Brand is required'
    }

    if (!formData.pricePerDay) {
      newErrors.pricePerDay = 'Price is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const data = {
      ...formData,

      pricePerDay: Number(formData.pricePerDay),

      year: Number(formData.year),

      seats: Number(formData.seats),

      features: formData.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),

      // Backend expects these values
      status: formData.status,

      available: formData.status === 'available',
    }

    // ============================================================
    // UPDATE VEHICLE
    // ============================================================

    if (isEdit) {
      dispatch(
        updateVehicle({
          id: vehicle._id,
          vehicleData: data,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Vehicle updated successfully')
          onClose?.()
        })
        .catch((err) => {
          toast.error(
            typeof err === 'string'
              ? err
              : err?.message || 'Failed to update vehicle'
          )
        })

    // ============================================================
    // CREATE VEHICLE
    // ============================================================

    } else {
      dispatch(createVehicle(data))
        .unwrap()
        .then(() => {
          toast.success('Vehicle created successfully')
          onClose?.()
        })
        .catch((err) => {
          toast.error(
            typeof err === 'string'
              ? err
              : err?.message || 'Failed to create vehicle'
          )
        })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* NAME */}

            <div>
              <label className="label">Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${
                  errors.name ? 'border-danger' : ''
                }`}
              />

              {errors.name && (
                <p className="text-danger text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* TYPE */}

            <div>
              <label className="label">Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input capitalize"
              >
                {Object.values(VEHICLE_TYPES).map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="capitalize"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* BRAND */}

            <div>
              <label className="label">Brand</label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`input ${
                  errors.brand ? 'border-danger' : ''
                }`}
              />

              {errors.brand && (
                <p className="text-danger text-sm mt-1">
                  {errors.brand}
                </p>
              )}
            </div>

            {/* MODEL */}

            <div>
              <label className="label">Model</label>

              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* YEAR */}

            <div>
              <label className="label">Year</label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* PRICE */}

            <div>
              <label className="label">Price Per Day ($)</label>

              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                className={`input ${
                  errors.pricePerDay
                    ? 'border-danger'
                    : ''
                }`}
              />

              {errors.pricePerDay && (
                <p className="text-danger text-sm mt-1">
                  {errors.pricePerDay}
                </p>
              )}
            </div>

            {/* SEATS */}

            <div>
              <label className="label">Seats</label>

              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* TRANSMISSION */}

            <div>
              <label className="label">Transmission</label>

              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="input capitalize"
              >
                <option value="automatic">
                  Automatic
                </option>

                <option value="manual">
                  Manual
                </option>
              </select>
            </div>

            {/* FUEL TYPE */}

            <div>
              <label className="label">Fuel Type</label>

              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="input capitalize"
              >
                <option value="petrol">
                  Petrol
                </option>

                <option value="diesel">
                  Diesel
                </option>

                <option value="electric">
                  Electric
                </option>

                <option value="hybrid">
                  Hybrid
                </option>
              </select>
            </div>

            {/* IMAGE */}

            <div>
              <label className="label">Image URL</label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* =================================================
                VEHICLE STATUS
            ================================================== */}

            <div>
              <label className="label">
                Vehicle Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleStatusChange}
                className="input capitalize"
              >
                <option value="available">
                  Available
                </option>

                <option value="maintenance">
                  Maintenance
                </option>

                <option value="rented">
                  Rented
                </option>

                <option value="reserved">
                  Reserved
                </option>

                <option value="retired">
                  Retired
                </option>
              </select>

              {formData.status === 'maintenance' && (
                <p className="text-sm text-orange-600 mt-1">
                  This vehicle will be unavailable for customer bookings while it is under maintenance.
                </p>
              )}

              {formData.status === 'rented' && (
                <p className="text-sm text-slate-500 mt-1">
                  This vehicle cannot be booked while it is rented.
                </p>
              )}

              {formData.status === 'reserved' && (
                <p className="text-sm text-slate-500 mt-1">
                  This vehicle cannot be booked while it is reserved.
                </p>
              )}

              {formData.status === 'retired' && (
                <p className="text-sm text-red-600 mt-1">
                  Retired vehicles cannot be booked.
                </p>
              )}
            </div>

          </div>

          {/* FEATURES */}

          <div>
            <label className="label">
              Features (comma separated)
            </label>

            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="input"
              placeholder="GPS, Bluetooth, Leather Seats"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="label">
              Description
            </label>

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* =====================================================
              STATUS SUMMARY
          ====================================================== */}

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">

            <div className="flex items-center justify-between">

              <span className="text-sm font-medium text-slate-700">
                Customer Booking Availability
              </span>

              <span
                className={`text-sm font-semibold ${
                  formData.status === 'available'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formData.status === 'available'
                  ? 'Available for booking'
                  : 'Unavailable for booking'}
              </span>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEdit
                  ? 'Update Vehicle'
                  : 'Add Vehicle'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default VehicleForm