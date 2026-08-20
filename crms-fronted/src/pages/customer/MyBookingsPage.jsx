import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import BookingFilter from '../../components/booking/BookingFilter'
import BookingList from '../../components/booking/BookingList'

function MyBookingsPage() {
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector((state) => state.bookings)

  useEffect(() => {
    dispatch(fetchBookings({}))
  }, [dispatch])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-600 mt-1">View and manage your bookings</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <BookingFilter onFilter={() => {}} />
        </div>
        <div className="flex-1">
          <BookingList bookings={bookings} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default MyBookingsPage
