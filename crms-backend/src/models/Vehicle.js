const db = require('../db').db
const { nowIso } = require('../db')

function serialize(row) {
  if (!row) return null
  return {
    _id: String(row.id),
    id: String(row.id),
    name: row.name,
    brand: row.brand,
    model: row.model,
    type: row.type,
    transmission: row.transmission,
    fuelType: row.fuelType,
    seats: row.seats,
    pricePerDay: row.pricePerDay,
    registrationNumber: row.registrationNumber,
    image: row.image,
    features: JSON.parse(row.features || '[]'),
    description: row.description,
    rating: row.rating,
    isAvailable: !!row.isAvailable,
    unavailableDates: JSON.parse(row.unavailableDates || '[]'),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

// Frontend (customer) contract — mirrors src/data/mockData.js
function toClient(row) {
  if (!row) return null
  return {
    id: String(row.id),
    name: row.name,
    brand: row.brand,
    model: row.model,
    category: row.type,
    pricePerDay: row.pricePerDay,
    rating: row.rating,
    seats: row.seats,
    doors: row.doors ?? 4,
    transmission: row.transmission,
    fuelType: row.fuelType,
    luggage: row.luggage ?? 2,
    location: row.location ?? 'Nairobi',
    image: row.image,
    images: row.image ? [row.image] : [],
    features: Array.isArray(row.features) ? row.features : JSON.parse(row.features || '[]'),
    description: row.description,
    available: !!row.isAvailable,
    unavailableDates: Array.isArray(row.unavailableDates) ? row.unavailableDates : JSON.parse(row.unavailableDates || '[]'),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function findById(id) {
  return serialize(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(Number(id)))
}

function findAll(filter = {}) {
  const where = []
  const vals = []
  if (filter.isAvailable !== undefined) {
    where.push('isAvailable = ?')
    vals.push(filter.isAvailable ? 1 : 0)
  }
  if (filter.type) {
    where.push('type = ?')
    vals.push(filter.type)
  }
  if (filter.minPrice !== undefined) {
    where.push('pricePerDay >= ?')
    vals.push(Number(filter.minPrice))
  }
  if (filter.maxPrice !== undefined) {
    where.push('pricePerDay <= ?')
    vals.push(Number(filter.maxPrice))
  }
  if (filter.search) {
    where.push('(name LIKE ? OR brand LIKE ? OR model LIKE ?)')
    const s = `%${filter.search}%`
    vals.push(s, s, s)
  }
  const sql = `SELECT * FROM vehicles ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY createdAt DESC`
  return db.prepare(sql).all(...vals).map(toClient)
}

function create(data) {
  const {
    name, brand, model, type, transmission, fuelType, seats,
    pricePerDay, registrationNumber, image, features, description, rating, isAvailable,
    doors, luggage, location,
  } = data
  const ts = nowIso()
  const info = db.prepare(
    `INSERT INTO vehicles (name, brand, model, type, transmission, fuelType, seats, pricePerDay, registrationNumber, image, features, description, rating, isAvailable, doors, luggage, location, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    name, brand, model, type, transmission || 'automatic', fuelType || 'petrol', seats || 5,
    pricePerDay, registrationNumber, image || null, JSON.stringify(features || []),
    description || null, rating === undefined ? 4.5 : rating,
    isAvailable === undefined ? 1 : (isAvailable ? 1 : 0),
    doors || 4, luggage || 2, location || 'Nairobi', ts, ts
  )
  return findById(info.lastInsertRowid)
}

function update(id, data) {
  const existing = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(Number(id))
  if (!existing) return null
  const fields = ['name', 'brand', 'model', 'type', 'transmission', 'fuelType', 'seats',
    'pricePerDay', 'registrationNumber', 'image', 'features', 'description', 'rating', 'isAvailable',
    'doors', 'luggage', 'location']
  const sets = []
  const vals = []
  for (const f of fields) {
    if (data[f] !== undefined) {
      let v = data[f]
      if (f === 'features') v = JSON.stringify(v || [])
      if (f === 'isAvailable') v = v ? 1 : 0
      sets.push(`${f} = ?`)
      vals.push(v)
    }
  }
  if (!sets.length) return serialize(existing)
  sets.push('updatedAt = ?')
  vals.push(nowIso())
  vals.push(Number(id))
  db.prepare(`UPDATE vehicles SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
  return findById(Number(id))
}

function remove(id) {
  const row = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(Number(id))
  db.prepare('DELETE FROM vehicles WHERE id = ?').run(Number(id))
  return serialize(row)
}

module.exports = { findById, findAll, create, update, remove, serialize, toClient }
