const Payment = require('../models/Payment')
const Booking = require('../models/Booking')

const getPayments = async (req, res) => {
  try {
    const { status, booking, page = 1, limit = 20 } = req.query

    const payments = Payment.findMany({
      status,
      booking,
      customer: req.user.role === 'customer' ? req.user._id : undefined,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    })

    const populated = payments.map((p) => {
      const b = Booking.findById(p.booking)
      const client = Payment.toClient(p)
      if (b) {
        const bc = Booking.toClient(b)
        client.booking = {
          pickupDate: bc.pickupDate,
          dropoffDate: bc.returnDate,
          pickupLocation: bc.pickupLocation,
          dropoffLocation: bc.returnLocation,
        }
      }
      return client
    })

    res.json({ payments: populated })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body

    const booking = Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (req.user.role === 'customer' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' })
    }

    const existing = Payment.findMany({ booking: bookingId, status: 'completed' })
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Payment already made for this booking' })
    }

    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`

    const payment = Payment.create({
      booking: bookingId,
      customer: req.user._id,
      amount: amount || booking.totalAmount,
      method: method || 'mpesa',
      status: 'completed',
      transactionId,
      paidAt: new Date().toISOString(),
    })

    Booking.update(bookingId, { status: 'confirmed' })

    res.status(201).json({ payment: Payment.toClient(payment) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getPayment = async (req, res) => {
  try {
    const payment = Payment.findById(req.params.id)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (req.user.role === 'customer' && payment.customer !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this payment' })
    }

    res.json({ payment: Payment.toClient(payment) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const refundPayment = async (req, res) => {
  try {
    const payment = Payment.findById(req.params.id)
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    Payment.update(payment._id, { status: 'refunded' })

    res.json({ message: 'Payment refunded successfully', payment: Payment.toClient(Payment.findById(payment._id)) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getPayments, getPayment, createPayment, refundPayment }
