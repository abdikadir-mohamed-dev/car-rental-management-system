const path = require('path')
const Database = require('better-sqlite3')

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'crms.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

function nowIso() {
  return new Date().toISOString()
}

function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      driversLicense TEXT,
      licenseExpiry TEXT,
      country TEXT,
      profilePhoto TEXT,
      resetPasswordToken TEXT,
      resetPasswordExpire INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      type TEXT NOT NULL,
      transmission TEXT DEFAULT 'automatic',
      fuelType TEXT DEFAULT 'petrol',
      seats INTEGER DEFAULT 5,
      pricePerDay REAL NOT NULL,
      registrationNumber TEXT NOT NULL UNIQUE,
      image TEXT,
      features TEXT DEFAULT '[]',
      description TEXT,
      rating REAL DEFAULT 4.5,
      isAvailable INTEGER DEFAULT 1,
      unavailableDates TEXT DEFAULT '[]',
      doors INTEGER DEFAULT 4,
      luggage INTEGER DEFAULT 2,
      location TEXT DEFAULT 'Nairobi',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer INTEGER NOT NULL,
      vehicle INTEGER NOT NULL,
      pickupDate TEXT NOT NULL,
      dropoffDate TEXT NOT NULL,
      pickupLocation TEXT NOT NULL,
      dropoffLocation TEXT NOT NULL,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      specialRequests TEXT,
      cancellationReason TEXT,
      cancellationFee REAL DEFAULT 0,
      refundAmount REAL DEFAULT 0,
      drivingOption TEXT DEFAULT 'self',
      driverId INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (customer) REFERENCES users(id),
      FOREIGN KEY (vehicle) REFERENCES vehicles(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking INTEGER NOT NULL,
      customer INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT DEFAULT 'mpesa',
      status TEXT DEFAULT 'pending',
      transactionId TEXT UNIQUE,
      mpesaReceiptNumber TEXT,
      paidAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (booking) REFERENCES bookings(id),
      FOREIGN KEY (customer) REFERENCES users(id)
    );
  `)
}

// Safe migration for databases created before the new columns existed.
function migrateDb() {
  const alters = [
    'ALTER TABLE vehicles ADD COLUMN doors INTEGER DEFAULT 4',
    'ALTER TABLE vehicles ADD COLUMN luggage INTEGER DEFAULT 2',
    'ALTER TABLE vehicles ADD COLUMN location TEXT DEFAULT \'Nairobi\'',
    'ALTER TABLE bookings ADD COLUMN drivingOption TEXT DEFAULT \'self\'',
    'ALTER TABLE bookings ADD COLUMN driverId INTEGER',
  ]
  for (const sql of alters) {
    try {
      db.exec(sql)
    } catch (e) {
      // column already exists -> ignore
    }
  }
}

module.exports = { db, initializeDb, migrateDb, nowIso }
