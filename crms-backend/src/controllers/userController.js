const User = require('../models/User')

const getUsers = async (req, res) => {
  try {
    res.json({ users: User.list() })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getUser = async (req, res) => {
  try {
    const user = User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = User.remove(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getUsers, getUser, updateUser, deleteUser }
