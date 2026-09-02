// ============================================================
// VEHICLE MAPPER
// ============================================================

export const mapVehicle = (v = {}) => ({
  ...v,

  id: v._id || v.id,

  name: v.name,

  brand: v.make || v.brand,

  category: v.vehicle_type || v.category,

  pricePerDay:
    v.price_per_day ??
    v.pricePerDay,

  rating: v.rating,

  seats:
    v.seating_capacity ??
    v.seats,

  doors: v.doors,

  transmission: v.transmission,

  fuelType:
    v.fuel_type ||
    v.fuelType,

  luggage: v.luggage,

  location: v.location,

  image:
    v.image ||
    (
      Array.isArray(v.images)
        ? v.images[0]
        : undefined
    ),

  images:
    Array.isArray(v.images)
      ? v.images
      : [],

  features:
    Array.isArray(v.features)
      ? v.features
      : [],

  description: v.description,

  available:
    v.is_available ??
    v.available,
})


// ============================================================
// BOOKING MAPPER
// ============================================================

export const mapBooking = (b = {}) => ({
  ...b,

  // =========================
  // BASIC BOOKING DATA
  // =========================

  id:
    b._id ||
    b.id,

  vehicleId:
    b.vehicle?._id ||
    b.vehicle?.id ||
    b.vehicleId,

  driverId:
    b.driver?._id ||
    b.driver?.id ||
    b.driver_id ||
    b.driverId,

  pickupDate:
    b.pickup_date ||
    b.pickupDate,

  returnDate:
    b.dropoff_date ||
    b.return_date ||
    b.returnDate,

  dropoffDate:
    b.dropoff_date ||
    b.dropoffDate,

  totalPrice:
    b.total_amount ??
    b.totalPrice,

  totalAmount:
    b.total_amount ??
    b.totalAmount,

  // =========================
  // DRIVING OPTION
  // =========================
  //
  // Backend:
  // self
  // with_driver
  //
  // Frontend:
  // self
  // hire
  // =========================

  drivingOption:
    b.driving_option === 'with_driver'
      ? 'hire'
      : b.driving_option ||
        b.drivingOption,

  // =========================
  // LOCATIONS
  // =========================

  pickupLocation:
    b.pickup_location ||
    b.pickupLocation,

  dropoffLocation:
    b.dropoff_location ||
    b.dropoffLocation,

  returnLocation:
    b.return_location ||
    b.returnLocation ||
    b.dropoff_location ||
    b.dropoffLocation ||
    b.pickup_location ||
    b.pickupLocation,

  // =========================
  // VEHICLE
  // =========================

  vehicle: b.vehicle
    ? mapVehicle(b.vehicle)
    : null,

  // =========================
  // DRIVER
  // =========================

  driver: b.driver
    ? {
        ...b.driver,

        id:
          b.driver._id ||
          b.driver.id,

        name:
          b.driver.name,

        phone:
          b.driver.phone,

        email:
          b.driver.email,

        pricePerDay:
          b.driver.price_per_day ??
          b.driver.pricePerDay,
      }
    : null,

  // =========================
  // CUSTOMER / USER
  // =========================

  user: b.user
    ? {
        ...b.user,

        id:
          b.user._id ||
          b.user.id,

        name:
          b.user.name,

        email:
          b.user.email,

        phone:
          b.user.phone,

        licenseNumber:
          b.user.drivers_license ||
          b.user.licenseNumber,

        licenseExpiry:
          b.user.license_expiry ||
          b.user.licenseExpiry,
      }
    : null,
})


// ============================================================
// USER MAPPER
// ============================================================

export const mapUser = (u = {}) => ({
  ...u,

  id:
    u._id ||
    u.id,

  name: u.name,

  email: u.email,

  phone: u.phone,

  role: u.role,

  address: u.address,

  dateOfBirth:
    u.date_of_birth ||
    u.dateOfBirth,

  licenseNumber:
    u.drivers_license ||
    u.licenseNumber,

  licenseType:
    u.license_type ||
    u.licenseType,

  licenseIssueDate:
    u.license_issue_date ||
    u.licenseIssueDate,

  licenseExpiryDate:
    u.license_expiry ||
    u.licenseExpiryDate,

  licenseCountry:
    u.license_country ||
    u.licenseCountry,
})


// ============================================================
// PAYMENT MAPPER
// ============================================================

export const mapPayment = (p = {}) => ({
  ...p,

  id:
    p._id ||
    p.id,

  bookingId:
    p.booking?._id ||
    p.booking?.id ||
    p.bookingId,

  vehicle:
    p.booking?.vehicle?.name ||
    p.vehicle,

  date:
    p.createdAt ||
    p.created_at ||
    p.date,

  method: p.method,

  amount: p.amount,

  status: p.status,
})


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  mapVehicle,
  mapBooking,
  mapUser,
  mapPayment,
}