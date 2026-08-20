import StaffCalendar from '../../components/staff/StaffCalendar'

function StaffCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
      </div>
      <StaffCalendar />
    </div>
  )
}

export default StaffCalendarPage
