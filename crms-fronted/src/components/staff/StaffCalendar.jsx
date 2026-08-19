import { Calendar } from 'lucide-react'

function StaffCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const bookings = [3, 7, 12, 15, 18, 22, 25]

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        August 2026
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
              bookings.includes(day)
                ? 'bg-primary text-white font-medium'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-slate-600">Bookings</span>
        </div>
      </div>
    </div>
  )
}

export default StaffCalendar
