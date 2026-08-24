const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  pickupDate: { type: Date, required: true },
  dropoffDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'], default: 'pending' },
  specialRequests: { type: String },
  cancellationReason: { type: String },
  cancellationFee: { type: Number, default: 0 },
  refundAmount: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
