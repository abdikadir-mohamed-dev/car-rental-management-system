const Booking = require('../models/Booking')
const Vehicle = require('../models/Vehicle')
const Payment = require('../models/Payment')

const getBookings = async (req, res) => {
  try {
    const { status, customer, page = 1, limit = 20 } = req.query
    let customerFilter = customer
    if (req.user.role === 'customer') {
      customerFilter = req.user._id
    }

    const bookings = Booking.findMany({
      status,
      customer: customerFilter,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    })

    res.json({ bookings: bookings.map((b) => Booking.toClient(b)) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getBooking = async (req, res) => {
  try {
    let booking = Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    booking = Booking.populate(booking)

    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this booking' })
    }

    res.json({ booking: Booking.toClient(booking, true) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      pickupDate, dropoffDate, returnDate,
      pickupLocation, dropoffLocation, returnLocation,
      specialRequests, drivingOption, driverId,
    } = req.body

    const resolvedVehicleId = vehicleId
    const resolvedDropoff = returnDate || dropoffDate
    const resolvedDropoffLocation = returnLocation || dropoffLocation

    const vehicle = Vehicle.findById(resolvedVehicleId)
    if (!vehicle || !vehicle.isAvailable) {
      return res.status(404).json({ message: 'Vehicle not available' })
    }

    const pickup = new Date(pickupDate)
    const dropoff = new Date(resolvedDropoff)
    const now = new Date()

    if (pickup < now || dropoff <= pickup) {
      return res.status(400).json({ message: 'Invalid pickup or dropoff date' })
    }

    const conflicting = Booking.findConflicts(resolvedVehicleId, pickup.toISOString(), dropoff.toISOString())
    if (conflicting.length > 0) {
      return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' })
    }

    const totalDays = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24))
    const totalAmount = totalDays * vehicle.pricePerDay

    const booking = Booking.create({
      customer: req.user._id,
      vehicle: resolvedVehicleId,
      pickupDate: pickup.toISOString(),
      dropoffDate: dropoff.toISOString(),
      pickupLocation,
      dropoffLocation: resolvedDropoffLocation,
      totalAmount,
      specialRequests,
      drivingOption,
      driverId,
      status: 'pending',
    })

    res.status(201).json({ booking: Booking.toClient(Booking.populate(booking), true) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateBooking = async (req, res) => {
  try {
    let booking = Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' })
    }

    const { pickupDate, dropoffDate, returnDate, pickupLocation, dropoffLocation, returnLocation } = req.body
    const fields = {}

    if (pickupLocation) fields.pickupLocation = pickupLocation
    if (returnLocation) fields.dropoffLocation = returnLocation
    else if (dropoffLocation) fields.dropoffLocation = dropoffLocation

    const newPickup = pickupDate ? new Date(pickupDate) : new Date(booking.pickupDate)
    const newDropoff = (returnDate || dropoffDate) ? new Date(returnDate || dropoffDate) : new Date(booking.dropoffDate)

    if (pickupDate || dropoffDate || returnDate) {
      const vehicle = Vehicle.findById(booking.vehicle)

      if (newPickup < new Date() || newDropoff <= newPickup) {
        return res.status(400).json({ message: 'Invalid pickup or dropoff date' })
      }

      const conflicting = Booking.findConflicts(booking.vehicle, newPickup.toISOString(), newDropoff.toISOString(), booking._id)
      if (conflicting.length > 0) {
        return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' })
      }

      const totalDays = Math.ceil((newDropoff - newPickup) / (1000 * 60 * 60 * 24))
      fields.totalAmount = totalDays * (vehicle ? vehicle.pricePerDay : booking.totalAmount)
      fields.pickupDate = newPickup.toISOString()
      fields.dropoffDate = newDropoff.toISOString()
    }

    booking = Booking.update(booking._id, fields)
    res.json({ booking: Booking.toClient(Booking.populate(booking), true) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const cancelBooking = async (req, res) => {
  try {
    const booking = Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' })
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be cancelled' })
    }

    const pickup = new Date(booking.pickupDate)
    const now = new Date()
    const hoursUntilPickup = (pickup - now) / (1000 * 60 * 60)

    let cancellationFee = 0
    if (hoursUntilPickup < 48) {
      cancellationFee = booking.totalAmount * 0.5
    }

    Booking.update(booking._id, {
      status: 'cancelled',
      cancellationFee,
      refundAmount: booking.totalAmount - cancellationFee,
    })

    res.json({
      message: 'Booking cancelled successfully',
      refundAmount: booking.totalAmount - cancellationFee,
      cancellationFee,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getBookings, getBooking, createBooking, updateBooking, cancelBooking }
