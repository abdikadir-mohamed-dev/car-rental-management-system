const express = require('express')
const { getPayments, getPayment, createPayment, refundPayment } = require('../controllers/paymentController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getPayments)
router.get('/:id', protect, getPayment)
router.post('/', protect, createPayment)
router.post('/:id/refund', protect, refundPayment)

module.exports = router
