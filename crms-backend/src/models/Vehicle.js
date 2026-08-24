const mongoose = require('mongoose')

const vehicleSchema = mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true, enum: ['sedan', 'suv', 'truck', 'van', 'luxury', 'electric'] },
  transmission: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], default: 'petrol' },
  seats: { type: Number, default: 5 },
  pricePerDay: { type: Number, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  image: { type: String },
  features: [{ type: String }],
  description: { type: String },
  rating: { type: Number, default: 4.5 },
  isAvailable: { type: Boolean, default: true },
  unavailableDates: [{ type: Date }],
}, { timestamps: true })

module.exports = mongoose.model('Vehicle', vehicleSchema)
