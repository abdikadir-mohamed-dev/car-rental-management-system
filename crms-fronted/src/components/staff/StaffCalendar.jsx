import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const BOOKING_DAYS = {
  '2026-08-03': [{ time: '09:00 AM', customer: 'John Doe', vehicle: 'Toyota Camry', action: 'Check-out' }],
  '2026-08-07': [{ time: '10:30 AM', customer: 'Jane Smith', vehicle: 'Honda CR-V', action: 'Check-in' }],
  '2026-08-12': [{ time: '08:00 AM', customer: 'Alice Mwangi', vehicle: 'Toyota RAV4', action: 'Check-out' }],
  '2026-08-15': [{ time: '11:00 AM', customer: 'Brian Otieno', vehicle: 'Mazda CX-5', action: 'Check-in' }],
  '2026-08-18': [{ time: '09:30 AM', customer: 'Grace Njeri', vehicle: 'Nissan X-Trail', action: 'Check-out' }],
  '2026-08-22': [{ time: '02:00 PM', customer: 'David Kipchoge', vehicle: 'Subaru Forester', action: 'Check-in' }],
  '2026-08-25': [{ time: '10:00 AM', customer: 'Mary Wanjiku', vehicle: 'Volkswagen Golf', action: 'Check-out' }],
}

function StaffCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1))
  const [selectedDate, setSelectedDate] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const selectedDateKey = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null
  const selectedBookings = selectedDateKey ? (BOOKING_DAYS[selectedDateKey] || []) : []

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {monthName}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}
        {days.map((day) => {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasBooking = BOOKING_DAYS[dateKey]
          const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(new Date(year, month, day))}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                isSelected
                  ? 'bg-primary text-white font-medium'
                  : hasBooking
                    ? 'bg-primary-light text-primary font-medium hover:bg-primary hover:text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-slate-600">Bookings</span>
        </div>
      </div>
      {selectedDate && (
        <div className="mt-6">
          <h4 className="font-medium text-slate-900 mb-3">
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>
          {selectedBookings.length > 0 ? (
            <div className="space-y-2">
              {selectedBookings.map((booking, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{booking.customer}</p>
                    <p className="text-xs text-slate-600">{booking.vehicle} &middot; {booking.time}</p>
                  </div>
                  <span className="badge badge-info text-xs">{booking.action}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No bookings scheduled for this day.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default StaffCalendar
