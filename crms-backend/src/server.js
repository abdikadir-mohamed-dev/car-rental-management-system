require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initializeDb, migrateDb } = require('./db')
const authRoutes = require('./routes/auth')
const vehicleRoutes = require('./routes/vehicles')
const bookingRoutes = require('./routes/bookings')
const paymentRoutes = require('./routes/payments')
const userRoutes = require('./routes/users')

const app = express()

const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(s => s.trim()).filter(Boolean)
const corsOrigin = allowedOrigins.length ? allowedOrigins : '*'

app.use(cors({ origin: corsOrigin }))
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

initializeDb()
migrateDb()
console.log('SQLite database initialized')

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
