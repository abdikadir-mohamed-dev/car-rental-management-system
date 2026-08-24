const Vehicle = require('../models/Vehicle')

const getVehicles = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query

    const query = { isAvailable: true }

    if (type) query.type = type
    if (minPrice || maxPrice) query.pricePerDay = {}
    if (minPrice) query.pricePerDay.$gte = Number(minPrice)
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ]
    }

    const vehicles = await Vehicle.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ vehicles })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ vehicle })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body)
    res.status(201).json({ vehicle })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ vehicle })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle }
