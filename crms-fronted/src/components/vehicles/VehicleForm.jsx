import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createVehicle,
  updateVehicle,
} from '../../redux/slices/vehicleSlice'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { VEHICLE_TYPES } from '../../utils/constants'

function VehicleForm({ vehicle, onClose }) {
  const dispatch = useDispatch()

  const { loading } = useSelector(
    (state) => state.vehicles
  )

  const isEdit = !!vehicle

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    vehicleType: 'sedan',
    year: new Date().getFullYear(),
    dailyRentalRate: '',
    seatingCapacity: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    features: '',
    image: '',
    description: '',
    status: 'available',
    available: true,
  })

  const [errors, setErrors] = useState({})

  // ============================================================
  // INITIAL DATA FOR EDITING
  // ============================================================

  const initialFormData = useMemo(() => {
    const existingImage =
      vehicle?.images?.[0] ||
      vehicle?.image ||
      ''

    return {
      make:
        vehicle?.make ||
        vehicle?.brand ||
        '',

      model:
        vehicle?.model ||
        '',

      vehicleType:
        vehicle?.vehicleType ||
        vehicle?.vehicle_type ||
        vehicle?.type ||
        vehicle?.category ||
        'sedan',

      year:
        vehicle?.year ||
        new Date().getFullYear(),

      dailyRentalRate:
        vehicle?.dailyRentalRate ??
        vehicle?.daily_rental_rate ??
        vehicle?.pricePerDay ??
        '',

      seatingCapacity:
        vehicle?.seatingCapacity ??
        vehicle?.seating_capacity ??
        vehicle?.seats ??
        5,

      transmission:
        vehicle?.transmission ||
        'automatic',

      fuelType:
        vehicle?.fuelType ||
        vehicle?.fuel_type ||
        'petrol',

      features: Array.isArray(vehicle?.features)
        ? vehicle.features.join(', ')
        : vehicle?.features || '',

      image: existingImage,

      description:
        vehicle?.description ||
        '',

      status:
        vehicle?.status ||
        'available',

      available:
        vehicle?.available ??
        vehicle?.isAvailable ??
        vehicle?.is_available ??
        true,
    }
  }, [vehicle])

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  // ============================================================
  // INPUT CHANGE
  // ============================================================

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

    setFormData((prev) => ({
      ...prev,
      status,
      available: status === 'available',
    }))
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const newErrors = {}

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required'
    }

    if (!formData.dailyRentalRate) {
      newErrors.dailyRentalRate =
        'Price per day is required'
    } else if (
      Number(formData.dailyRentalRate) <= 0
    ) {
      newErrors.dailyRentalRate =
        'Price must be greater than 0'
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType =
        'Vehicle type is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    /*
     * IMPORTANT:
     *
     * These names match the Flask backend:
     *
     * make
     * model
     * vehicleType
     * dailyRentalRate
     * seatingCapacity
     * fuelType
     * images
     */

    const data = {
      make: formData.make.trim(),

      model: formData.model.trim(),

      vehicleType: formData.vehicleType,

      year: Number(formData.year),

      dailyRentalRate:
        Number(formData.dailyRentalRate),

      seatingCapacity:
        Number(formData.seatingCapacity),

      transmission:
        formData.transmission,

      fuelType:
        formData.fuelType,

      features:
        formData.features
          .split(',')
          .map((feature) => feature.trim())
          .filter(Boolean),

      /*
       * Backend expects an ARRAY of images.
       *
       * The form currently accepts one image URL,
       * so we put that URL inside the images array.
       */
      images: formData.image.trim()
        ? [formData.image.trim()]
        : [],

      description:
        formData.description.trim(),

      status:
        formData.status,

      available:
        formData.status === 'available',
    }

    try {
      if (isEdit) {
        await dispatch(
          updateVehicle({
            id: vehicle.id ?? vehicle._id,
            vehicleData: data,
          })
        ).unwrap()

        toast.success(
          'Vehicle updated successfully'
        )
      } else {
        await dispatch(
          createVehicle(data)
        ).unwrap()

        toast.success(
          'Vehicle created successfully'
        )
      }

      onClose?.()
    } catch (error) {
      console.error(
        'Vehicle save error:',
        error
      )

      toast.error(
        typeof error === 'string'
          ? error
          : error?.message ||
              'Failed to save vehicle'
      )
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEdit
                ? 'Edit Vehicle'
                : 'Add Vehicle'}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {isEdit
                ? 'Update vehicle information'
                : 'Add a vehicle to your fleet'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* MAKE */}

            <div>
              <label className="label">
                Make
              </label>

              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className={`input ${
                  errors.make
                    ? 'border-danger'
                    : ''
                }`}
                placeholder="Toyota"
              />

              {errors.make && (
                <p className="text-danger text-sm mt-1">
                  {errors.make}
                </p>
              )}
            </div>

            {/* MODEL */}

            <div>
              <label className="label">
                Model
              </label>

              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`input ${
                  errors.model
                    ? 'border-danger'
                    : ''
                }`}
                placeholder="Corolla"
              />

              {errors.model && (
                <p className="text-danger text-sm mt-1">
                  {errors.model}
                </p>
              )}
            </div>

            {/* TYPE */}

            <div>
              <label className="label">
                Vehicle Type
              </label>

              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="input capitalize"
              >
                {Object.values(VEHICLE_TYPES).map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* YEAR */}

            <div>
              <label className="label">
                Year
              </label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            {/* PRICE */}

            <div>
              <label className="label">
                Price Per Day (KES)
              </label>

              <input
                type="number"
                name="dailyRentalRate"
                value={formData.dailyRentalRate}
                onChange={handleChange}
                className={`input ${
                  errors.dailyRentalRate
                    ? 'border-danger'
                    : ''
                }`}
                placeholder="5000"
                min="1"
              />

              {errors.dailyRentalRate && (
                <p className="text-danger text-sm mt-1">
                  {errors.dailyRentalRate}
                </p>
              )}
            </div>

            {/* SEATS */}

            <div>
              <label className="label">
                Seating Capacity
              </label>

              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleChange}
                className="input"
                min="1"
              />
            </div>

            {/* TRANSMISSION */}

            <div>
              <label className="label">
                Transmission
              </label>

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

            {/* FUEL */}

            <div>
              <label className="label">
                Fuel Type
              </label>

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

          </div>

          {/* IMAGE */}

          <div>
            <label className="label">
              Vehicle Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/toyota-corolla.jpg"
            />

            <p className="text-xs text-slate-500 mt-1">
              Enter a direct URL to the vehicle image.
            </p>

            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Vehicle preview"
                  className="w-32 h-24 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* STATUS */}

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

            {formData.status ===
              'maintenance' && (
              <p className="text-sm text-orange-600 mt-1">
                This vehicle will be unavailable for
                customer bookings while under
                maintenance.
              </p>
            )}

            {formData.status === 'rented' && (
              <p className="text-sm text-slate-500 mt-1">
                This vehicle cannot be booked while
                it is rented.
              </p>
            )}

            {formData.status === 'reserved' && (
              <p className="text-sm text-slate-500 mt-1">
                This vehicle cannot be booked while
                it is reserved.
              </p>
            )}

            {formData.status === 'retired' && (
              <p className="text-sm text-red-600 mt-1">
                Retired vehicles cannot be booked.
              </p>
            )}
          </div>

          {/* FEATURES */}

          <div>
            <label className="label">
              Features
            </label>

            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="input"
              placeholder="GPS, Bluetooth, Leather Seats"
            />

            <p className="text-xs text-slate-500 mt-1">
              Separate features with commas.
            </p>
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
              placeholder="Describe the vehicle..."
            />
          </div>

          {/* AVAILABILITY SUMMARY */}

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Customer Booking Availability
              </span>

              <span
                className={`text-sm font-semibold ${
                  formData.status ===
                  'available'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formData.status ===
                'available'
                  ? 'Available for booking'
                  : 'Unavailable for booking'}
              </span>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex gap-3 pt-2">
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
              disabled={loading}
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