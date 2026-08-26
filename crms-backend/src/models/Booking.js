const db = require('../db').db
const { nowIso } = require('../db')
const User = require('./User')
const Vehicle = require('./Vehicle')

function build(row) {
  if (!row) return null
  return {
    _id: String(row.id),
    id: String(row.id),
    customer: row.customer,
    vehicle: row.vehicle,
    pickupDate: row.pickupDate,
    dropoffDate: row.dropoffDate,
    pickupLocation: row.pickupLocation,
    dropoffLocation: row.dropoffLocation,
    totalAmount: row.totalAmount,
    status: row.status,
    specialRequests: row.specialRequests,
    cancellationReason: row.cancellationReason,
    cancellationFee: row.cancellationFee,
    refundAmount: row.refundAmount,
    drivingOption: row.drivingOption,
    driverId: row.driverId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function populate(booking) {
  if (!booking) return null
  const cust = db.prepare('SELECT * FROM users WHERE id = ?').get(booking.customer)
  const veh = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(booking.vehicle)
  booking.customer = User.publicUser(cust)
  booking.vehicle = Vehicle.serialize(veh)
  return booking
}

function getPaymentStatus(bookingId) {
  const p = db.prepare('SELECT status FROM payments WHERE booking = ? ORDER BY createdAt DESC LIMIT 1').get(Number(bookingId))
  if (!p) return 'pending'
  if (p.status === 'completed') return 'paid'
  if (p.status === 'refunded') return 'refunded'
  return 'pending'
}

function toClient(b, populate = false) {
  if (!b) return null
  const customerId = typeof b.customer === 'object' && b.customer ? b.customer.id : b.customer
  const vehicleId = typeof b.vehicle === 'object' && b.vehicle ? b.vehicle.id : b.vehicle
  const pickup = new Date(b.pickupDate)
  const drop = new Date(b.dropoffDate)
  const duration = Math.max(1, Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24)))
  const statusMap = {
    pending: 'upcoming', confirmed: 'upcoming', active: 'upcoming',
    completed: 'completed', cancelled: 'cancelled',
  }
  const obj = {
    id: String(b.id),
    customerId: String(customerId),
    vehicleId: String(vehicleId),
    pickupLocation: b.pickupLocation,
    returnLocation: b.dropoffLocation,
    pickupDate: b.pickupDate ? b.pickupDate.slice(0, 10) : undefined,
    returnDate: b.dropoffDate ? b.dropoffDate.slice(0, 10) : undefined,
    duration,
    drivingOption: b.drivingOption || 'self',
    driverId: b.driverId ?? null,
    vehiclePrice: Math.round((b.totalAmount || 0) / duration),
    driverPrice: 0,
    totalPrice: b.totalAmount,
    status: statusMap[b.status] || b.status,
    paymentStatus: b.paymentStatus || getPaymentStatus(b.id),
    bookingDate: b.createdAt ? b.createdAt.slice(0, 10) : undefined,
    specialRequests: b.specialRequests,
    cancellationReason: b.cancellationReason,
    cancellationFee: b.cancellationFee,
    refundAmount: b.refundAmount,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }
  if (populate) {
    const veh = typeof b.vehicle === 'object' && b.vehicle ? b.vehicle : Vehicle.serialize(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(b.vehicle))
    const cust = typeof b.customer === 'object' && b.customer ? b.customer : User.publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(b.customer))
    obj.vehicle = veh ? {
      id: veh.id, name: veh.name, brand: veh.brand, image: veh.image,
      pricePerDay: veh.pricePerDay, category: veh.type, rating: veh.rating,
    } : null
    obj.customer = cust
  }
  return obj
}

function findById(id) {
  return build(db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(id)))
}

function findMany({ status, customer, limit = 20, offset = 0 }) {
  const where = []
  const vals = []
  if (status) {
    where.push('status = ?')
    vals.push(status)
  }
  if (customer) {
    where.push('customer = ?')
    vals.push(Number(customer))
  }
  const sql = `SELECT * FROM bookings ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY createdAt DESC LIMIT ? OFFSET ?`
  vals.push(Number(limit), Number(offset))
  return db.prepare(sql).all(...vals).map(build)
}

function findConflicts(vehicleId, pickupIso, dropoffIso, excludeId) {
  const where = [
    'vehicle = ?',
    "status IN ('pending', 'confirmed', 'active')",
    '((pickupDate <= ? AND pickupDate >= ?) OR (dropoffDate <= ? AND dropoffDate >= ?))',
  ]
  const vals = [Number(vehicleId), dropoffIso, pickupIso, dropoffIso, pickupIso]
  if (excludeId) {
    where.push('id != ?')
    vals.push(Number(excludeId))
  }
  return db.prepare(`SELECT * FROM bookings WHERE ${where.join(' AND ')}`).all(...vals)
}

function create(data) {
  const {
    customer, vehicle, pickupDate, dropoffDate, pickupLocation,
    dropoffLocation, totalAmount, specialRequests, status, drivingOption, driverId,
  } = data
  const ts = nowIso()
  const info = db.prepare(
    `INSERT INTO bookings (customer, vehicle, pickupDate, dropoffDate, pickupLocation, dropoffLocation, totalAmount, status, specialRequests, drivingOption, driverId, cancellationFee, refundAmount, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    Number(customer), Number(vehicle), pickupDate, dropoffDate, pickupLocation,
    dropoffLocation, totalAmount, status || 'pending',
    specialRequests || null, drivingOption || 'self', driverId ? Number(driverId) : null,
    0, 0, ts, ts
  )
  return findById(info.lastInsertRowid)
}

function update(id, fields) {
  const allowed = ['pickupDate', 'dropoffDate', 'pickupLocation', 'dropoffLocation',
    'totalAmount', 'status', 'specialRequests', 'cancellationReason', 'cancellationFee', 'refundAmount',
    'drivingOption', 'driverId']
  const sets = []
  const vals = []
  for (const f of allowed) {
    if (fields[f] !== undefined) {
      sets.push(`${f} = ?`)
      vals.push(fields[f])
    }
  }
  if (!sets.length) return findById(id)
  sets.push('updatedAt = ?')
  vals.push(nowIso())
  vals.push(Number(id))
  db.prepare(`UPDATE bookings SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
  return findById(Number(id))
}

function remove(id) {
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(id))
  db.prepare('DELETE FROM bookings WHERE id = ?').run(Number(id))
  return build(row)
}

module.exports = { build, populate, toClient, findById, findMany, findConflicts, create, update, remove }
