import BookingManagement from '../../components/staff/BookingManagement'

function StaffBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
      </div>
      <BookingManagement />
    </div>
  )
}

export default StaffBookingsPage
