import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

function AvailabilityCalendar({ vehicleId, selectedDates, onSelect, unavailableDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isUnavailable = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return unavailableDates.some(d => new Date(d).toDateString() === date.toDateString())
  }

  const isSelected = (day) => {
    if (!selectedDates) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return selectedDates.some(d => new Date(d).toDateString() === date.toDateString())
  }

  const isToday = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return new Date().toDateString() === date.toDateString()
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        onClick={() => !isUnavailable(day) && onSelect?.(day)}
        disabled={isUnavailable(day)}
        className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
          isUnavailable(day)
            ? 'bg-slate-100 text-slate-300 cursor-not-allowed line-through'
            : isSelected(day)
            ? 'bg-primary text-white'
            : isToday(day)
            ? 'border-2 border-primary text-primary'
            : 'hover:bg-slate-100 text-slate-700'
        }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-slate-900">Availability</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-100 rounded-full line-through" />
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvailabilityCalendar
