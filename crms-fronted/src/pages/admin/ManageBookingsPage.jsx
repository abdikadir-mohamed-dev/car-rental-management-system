import { useState } from 'react'
import BookingManagement from '../../components/admin/BookingManagement'

function ManageBookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState(null)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Bookings</h1>
        <p className="text-slate-600 mt-1">View and manage all bookings</p>
      </div>
      <BookingManagement onView={(booking) => setSelectedBooking(booking)} />
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Booking Details</h2>
            </div>
            <div className="p-6 space-y-3">
              <div><span className="text-slate-600">Booking ID:</span> <span className="font-medium text-slate-900">{selectedBooking._id}</span></div>
              <div><span className="text-slate-600">Vehicle:</span> <span className="font-medium text-slate-900">{selectedBooking.vehicle?.name}</span></div>
              <div><span className="text-slate-600">Customer:</span> <span className="font-medium text-slate-900">{selectedBooking.user?.name}</span></div>
              <div><span className="text-slate-600">Pickup:</span> <span className="font-medium text-slate-900">{selectedBooking.pickupDate}</span></div>
              <div><span className="text-slate-600">Dropoff:</span> <span className="font-medium text-slate-900">{selectedBooking.dropoffDate}</span></div>
              <div><span className="text-slate-600">Status:</span> <span className="font-medium text-slate-900 capitalize">{selectedBooking.status}</span></div>
               <div><span className="text-slate-600">Total:</span> <span className="font-medium text-slate-900">KES {selectedBooking.totalAmount.toLocaleString()}</span></div>
            </div>
            <div className="p-6 border-t border-slate-200">
              <button onClick={() => setSelectedBooking(null)} className="btn-secondary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBookingsPage
