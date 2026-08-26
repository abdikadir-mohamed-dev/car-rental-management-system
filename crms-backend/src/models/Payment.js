const db = require('../db').db
const { nowIso } = require('../db')

function build(row) {
  if (!row) return null
  return {
    _id: String(row.id),
    id: String(row.id),
    booking: row.booking,
    customer: row.customer,
    amount: row.amount,
    method: row.method,
    status: row.status,
    transactionId: row.transactionId,
    mpesaReceiptNumber: row.mpesaReceiptNumber,
    paidAt: row.paidAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toClient(row) {
  if (!row) return null
  return {
    id: String(row.id),
    bookingId: String(row.booking),
    customerId: String(row.customer),
    amount: row.amount,
    method: row.method,
    status: row.status,
    transactionId: row.transactionId,
    mpesaReceiptNumber: row.mpesaReceiptNumber,
    paidAt: row.paidAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function findMany({ status, booking, customer, limit = 20, offset = 0 }) {
  const where = []
  const vals = []
  if (status) {
    where.push('status = ?')
    vals.push(status)
  }
  if (booking) {
    where.push('booking = ?')
    vals.push(Number(booking))
  }
  if (customer) {
    where.push('customer = ?')
    vals.push(Number(customer))
  }
  const sql = `SELECT * FROM payments ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY createdAt DESC LIMIT ? OFFSET ?`
  vals.push(Number(limit), Number(offset))
  return db.prepare(sql).all(...vals).map(build)
}

function findById(id) {
  return build(db.prepare('SELECT * FROM payments WHERE id = ?').get(Number(id)))
}

function create(data) {
  const {
    booking, customer, amount, method, status,
    transactionId, mpesaReceiptNumber, paidAt,
  } = data
  const ts = nowIso()
  const info = db.prepare(
    `INSERT INTO payments (booking, customer, amount, method, status, transactionId, mpesaReceiptNumber, paidAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    Number(booking), Number(customer), amount, method || 'mpesa', status || 'pending',
    transactionId || null, mpesaReceiptNumber || null, paidAt || null, ts, ts
  )
  return findById(info.lastInsertRowid)
}

function update(id, fields) {
  const allowed = ['amount', 'method', 'status', 'transactionId', 'mpesaReceiptNumber', 'paidAt']
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
  db.prepare(`UPDATE payments SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
  return findById(Number(id))
}

function remove(id) {
  const row = db.prepare('SELECT * FROM payments WHERE id = ?').get(Number(id))
  db.prepare('DELETE FROM payments WHERE id = ?').run(Number(id))
  return build(row)
}

module.exports = { findMany, findById, create, update, remove, build, toClient }
