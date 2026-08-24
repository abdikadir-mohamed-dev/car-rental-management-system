const Payment = require('../models/Payment')
const Booking = require('../models/Booking')

const getPayments = async (req, res) => {
  try {
    const { status, booking, page = 1, limit = 20 } = req.query
    const query = {}

    if (status) query.status = status
    if (booking) query.booking = booking
    if (req.user.role === 'customer') {
      query.customer = req.user._id
    }

    const payments = await Payment.find(query)
      .populate('booking', 'pickupDate dropoffDate pickupLocation dropoffLocation')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })

    res.json({ payments })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' })
    }

    const existingPayment = await Payment.findOne({ booking: bookingId, status: 'completed' })
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already made for this booking' })
    }

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`

    const payment = await Payment.create({
      booking: bookingId,
      customer: req.user._id,
      amount: amount || booking.totalAmount,
      method: method || 'mpesa',
      status: 'completed',
      transactionId,
      paidAt: new Date(),
    })

    booking.status = 'confirmed'
    await booking.save()

    res.status(201).json({ payment })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    payment.status = 'refunded'
    await payment.save()

    res.json({ message: 'Payment refunded successfully', payment })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getPayments, createPayment, refundPayment }
