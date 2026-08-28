import Loader from '../common/Loader'
import BookingCard from './BookingCard'

function BookingList({ bookings, loading }) {
  if (loading) {
    return <Loader />
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  )
}

export default BookingList
