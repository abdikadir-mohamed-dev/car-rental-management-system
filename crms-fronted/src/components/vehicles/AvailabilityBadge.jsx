/*
 * Small status badge shown on vehicle listing/detail views so a
 * customer knows a car's availability before they start booking it,
 * instead of only finding out at checkout.
 */
function AvailabilityBadge({ vehicle, className = '' }) {
  if (!vehicle) return null

  const status = String(vehicle.status || '').toLowerCase()
  const isAvailable = vehicle.available ?? vehicle.isAvailable ?? true

  let label = 'Available Now'
  let styles = 'bg-emerald-100 text-emerald-700'

  if (status === 'maintenance') {
    label = 'In Maintenance'
    styles = 'bg-amber-100 text-amber-700'
  } else if (!isAvailable) {
    label = 'Unavailable'
    styles = 'bg-red-100 text-red-700'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export default AvailabilityBadge
