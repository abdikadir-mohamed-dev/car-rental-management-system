const express = require('express')
const { body } = require('express-validator')
const { register, login, logout, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register)

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login)

router.post('/logout', logout)
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
], forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)

module.exports = router
