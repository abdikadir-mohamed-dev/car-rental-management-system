const express = require('express')
const { getBookings, getBooking, createBooking, updateBooking, cancelBooking } = require('../controllers/bookingController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getBookings)
router.get('/:id', protect, getBooking)
router.post('/', protect, createBooking)
router.put('/:id', protect, updateBooking)
router.delete('/:id', protect, cancelBooking)

module.exports = router
