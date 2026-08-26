const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { validationResult } = require('express-validator')

const generateToken = (id) => {
  return jwt.sign({ id: String(id) }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}

const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, phone, password, role, driversLicense, licenseExpiry, country } = req.body

    const userExists = User.findByEmail(email)
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    const user = await User.create({
      name, email, phone, password,
      role: role || 'customer',
      driversLicense, licenseExpiry, country,
    })

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = User.findByEmail(email)

    if (!user || !(await User.matchPassword(user, password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' })
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = User.findByEmail(email)

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' })
    }

    const resetToken = Math.random().toString(36).slice(-8)
    await User.update(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpire: Date.now() + 3600000,
    })

    res.json({ message: 'Password reset token sent to email', resetToken })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = User.findByResetToken(token)

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }

    await User.update(user._id, {
      password,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    })

    res.json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getProfile = async (req, res) => {
  res.json(req.user)
}

const updateProfile = async (req, res) => {
  try {
    const user = await User.update(req.user._id, req.body)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await User.matchPassword(user, currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    await User.update(req.user._id, { password: newPassword })
    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword, getProfile, updateProfile, changePassword }
