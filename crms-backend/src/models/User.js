const db = require('../db').db
const { nowIso } = require('../db')
const bcrypt = require('bcryptjs')

function publicUser(row) {
  if (!row) return null
  return {
    _id: String(row.id),
    id: String(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role || 'customer',
    driversLicense: row.driversLicense,
    licenseExpiry: row.licenseExpiry,
    country: row.country,
    profilePhoto: row.profilePhoto,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function fullUser(row) {
  const u = publicUser(row)
  if (row) {
    u.password = row.password
    u.resetPasswordToken = row.resetPasswordToken
    u.resetPasswordExpire = row.resetPasswordExpire
  }
  return u
}

async function create(data) {
  const {
    name, email, phone, password, role,
    driversLicense, licenseExpiry, country,
  } = data
  const hashed = await bcrypt.hash(password, 12)
  const ts = nowIso()
  const info = db.prepare(
    `INSERT INTO users (name, email, phone, password, role, driversLicense, licenseExpiry, country, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    name, email, phone, hashed, role || 'customer',
    driversLicense || null, licenseExpiry || null, country || null, ts, ts
  )
  return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid))
}

function findByEmail(email) {
  return fullUser(db.prepare('SELECT * FROM users WHERE email = ?').get(email))
}

function findById(id, withPassword = false) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id))
  return withPassword ? fullUser(row) : publicUser(row)
}

function findByResetToken(token) {
  const row = db.prepare(
    'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpire > ?'
  ).get(token, Date.now())
  return fullUser(row)
}

async function update(id, data) {
  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id))
  if (!existing) return null
  if (data.password) data.password = await bcrypt.hash(data.password, 12)

  const fields = ['name', 'email', 'phone', 'role', 'driversLicense', 'licenseExpiry',
    'country', 'profilePhoto', 'password', 'resetPasswordToken', 'resetPasswordExpire']
  const sets = []
  const vals = []
  for (const f of fields) {
    if (data[f] !== undefined) {
      sets.push(`${f} = ?`)
      vals.push(data[f] === undefined ? null : data[f])
    }
  }
  if (!sets.length) return publicUser(existing)
  sets.push('updatedAt = ?')
  vals.push(nowIso())
  vals.push(Number(id))
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
  return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id)))
}

function remove(id) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id))
  db.prepare('DELETE FROM users WHERE id = ?').run(Number(id))
  return publicUser(row)
}

function list() {
  const rows = db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all()
  return rows.map(publicUser)
}

async function matchPassword(user, entered) {
  if (!user || !user.password) return false
  return bcrypt.compare(entered, user.password)
}

module.exports = {
  create, findByEmail, findById, findByResetToken,
  update, remove, list, matchPassword, publicUser, fullUser,
}
