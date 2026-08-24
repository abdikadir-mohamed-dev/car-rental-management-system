const Booking = require('../models/Booking')
const Vehicle = require('../models/Vehicle')
const Payment = require('../models/Payment')

const getBookings = async (req, res) => {
  try {
    const { status, customer, page = 1, limit = 20 } = req.query
    const query = {}

    if (status) query.status = status
    if (customer) query.customer = customer
    if (req.user.role === 'customer') {
      query.customer = req.user._id
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name brand model type pricePerDay image')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    res.json({ bookings })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone driversLicense licenseExpiry')
      .populate('vehicle')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this booking' })
    }

    res.json({ booking })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createBooking = async (req, res) => {
  try {
    const { vehicleId, pickupDate, dropoffDate, pickupLocation, dropoffLocation, specialRequests } = req.body

    const vehicle = await Vehicle.findById(vehicleId)
    if (!vehicle || !vehicle.isAvailable) {
      return res.status(404).json({ message: 'Vehicle not available' })
    }

    const pickup = new Date(pickupDate)
    const dropoff = new Date(dropoffDate)
    const now = new Date()

    if (pickup < now || dropoff <= pickup) {
      return res.status(400).json({ message: 'Invalid pickup or dropoff date' })
    }

    const conflictingBookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        { pickupDate: { $lte: dropoff, $gte: pickup } },
        { dropoffDate: { $lte: dropoff, $gte: pickup } },
      ],
    })

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' })
    }

    const totalDays = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24))
    const totalAmount = totalDays * vehicle.pricePerDay

    const booking = await Booking.create({
      customer: req.user._id,
      vehicle: vehicleId,
      pickupDate: pickup,
      dropoffDate: dropoff,
      pickupLocation,
      dropoffLocation,
      totalAmount,
      specialRequests,
      status: 'pending',
    })

    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name brand model type pricePerDay image')

    res.status(201).json({ booking: populatedBooking })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' })
    }

    const { pickupDate, dropoffDate, pickupLocation, dropoffLocation } = req.body

    if (pickupDate || dropoffDate) {
      const newPickup = pickupDate ? new Date(pickupDate) : booking.pickupDate
      const newDropoff = dropoffDate ? new Date(dropoffDate) : booking.dropoffDate
      const vehicle = await Vehicle.findById(booking.vehicle)

      if (newPickup < new Date() || newDropoff <= newPickup) {
        return res.status(400).json({ message: 'Invalid pickup or dropoff date' })
      }

      const conflictingBookings = await Booking.find({
        _id: { $ne: booking._id },
        vehicle: booking.vehicle,
        status: { $in: ['pending', 'confirmed', 'active'] },
        $or: [
          { pickupDate: { $lte: newDropoff, $gte: newPickup } },
          { dropoffDate: { $lte: newDropoff, $gte: newPickup } },
        ],
      })

      if (conflictingBookings.length > 0) {
        return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' })
      }

      const totalDays = Math.ceil((newDropoff - newPickup) / (1000 * 60 * 60 * 24))
      booking.totalAmount = totalDays * (vehicle?.pricePerDay || booking.totalAmount)
      booking.pickupDate = newPickup
      booking.dropoffDate = newDropoff
    }

    if (pickupLocation) booking.pickupLocation = pickupLocation
    if (dropoffLocation) booking.dropoffLocation = dropoffLocation

    await booking.save()
    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'name brand model type pricePerDay image')

    res.json({ booking: updatedBooking })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
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

    booking.status = 'cancelled'
    booking.cancellationFee = cancellationFee
    booking.refundAmount = booking.totalAmount - cancellationFee
    await booking.save()

    res.json({
      message: 'Booking cancelled successfully',
      refundAmount: booking.refundAmount,
      cancellationFee,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getBookings, getBooking, createBooking, updateBooking, cancelBooking }
