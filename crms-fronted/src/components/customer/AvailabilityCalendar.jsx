import { useMemo, useEffect, useState } from 'react'
import { getBookings } from '../../services/bookingService'
import { mapBooking } from '../../utils/apiMappers'
import Loader from '../../components/common/Loader'

function AvailabilityCalendar({ vehicleId, pickupDate, returnDate, onSelectRange }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const data = await getBookings()
        setBookings((data || []).map(mapBooking))
      } catch (err) {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [vehicleId])

  const bookedRanges = useMemo(() => {
    return bookings
      .filter(b => b.vehicleId === vehicleId)
      .map(b => ({ start: new Date(b.pickupDate), end: new Date(b.returnDate) }))
  }, [bookings, vehicleId])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const isBooked = (day) => {
    const date = new Date(currentYear, currentMonth, day)
    return bookedRanges.some(range => date >= range.start && date <= range.end)
  }

  const isPast = (day) => {
    const date = new Date(currentYear, currentMonth, day)
    return date < today
  }

  const isSelected = (day) => {
    if (!pickupDate || !returnDate) return false
    const date = new Date(currentYear, currentMonth, day)
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    return date >= pickup && date <= returnD
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const booked = isBooked(day)
    const past = isPast(day)
    const selected = isSelected(day)
    days.push(
      <div
        key={day}
        className={`h-8 flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors ${
          selected
            ? 'bg-blue-600 text-white'
            : past
            ? 'text-slate-300'
            : booked
            ? 'bg-red-100 text-red-700'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        {day}
      </div>
    )
  }

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Availability Calendar</h3>
        <Loader />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-900 mb-3">Availability Calendar</h3>
      <div className="mb-2 text-sm text-slate-600">{monthName}</div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="h-8 flex items-center justify-center text-xs font-medium text-slate-500">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-200" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-slate-100" />
          <span>Available</span>
        </div>
      </div>
    </div>
  )
}

export default AvailabilityCalendar
