const Vehicle = require('../models/Vehicle')

const getVehicles = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query

    const vehicles = Vehicle.findAll({
      isAvailable: true,
      type: type || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search: search || undefined,
    })

    const start = (Number(page) - 1) * Number(limit)
    const paged = vehicles.slice(start, start + Number(limit))

    res.json({ vehicles: paged })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getVehicle = async (req, res) => {
  try {
    const vehicle = Vehicle.findById(req.params.id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ vehicle: Vehicle.toClient(vehicle) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const createVehicle = async (req, res) => {
  try {
    const vehicle = Vehicle.create(req.body)
    res.status(201).json({ vehicle: Vehicle.toClient(vehicle) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const updateVehicle = async (req, res) => {
  try {
    const vehicle = Vehicle.update(req.params.id, req.body)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ vehicle: Vehicle.toClient(vehicle) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = Vehicle.remove(req.params.id)
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' })
    }
    res.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getVehicles, getVehicle, createVehicle, updateVehicle, deleteVehicle }
