import { Calendar } from 'lucide-react'

function DateRangePicker({ start, end, onChange }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Date Range
      </h3>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="label">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={(e) => onChange?.({ ...onChange, start: e.target.value })}
            className="input"
          />
        </div>
        <div className="flex-1">
          <label className="label">End Date</label>
          <input
            type="date"
            value={end}
            onChange={(e) => onChange?.({ ...onChange, end: e.target.value })}
            className="input"
          />
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
