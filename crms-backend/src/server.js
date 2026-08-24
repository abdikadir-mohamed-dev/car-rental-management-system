require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const vehicleRoutes = require('./routes/vehicles')
const bookingRoutes = require('./routes/bookings')
const paymentRoutes = require('./routes/payments')
const userRoutes = require('./routes/users')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Car Rental Management System API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/users', userRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
