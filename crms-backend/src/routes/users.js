const express = require('express')
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController')
const { getProfile, updateProfile, changePassword } = require('../controllers/authController')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, authorize('admin'), getUsers)
router.get('/:id', protect, getUser)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, authorize('admin'), deleteUser)

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)

module.exports = router
