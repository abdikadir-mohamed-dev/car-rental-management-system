import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { Star, Send, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { BOOKING_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'

function ReviewsPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('booking')
  const dispatch = useDispatch()
  const { bookings = [], loading } = useSelector((state) => state.bookings)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(bookingId || '')

  useEffect(() => {
    dispatch(fetchBookings({ status: BOOKING_STATUS.COMPLETED }))
  }, [dispatch])

  const completedBookings = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED)
  const targetBooking = completedBookings.find((b) => b._id === selectedBooking) || completedBookings[0]

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }
    toast.success('Thank you for your review!')
    setRating(0)
    setReviewText('')
    setSelectedBooking('')
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reviews</h1>
        <p className="text-slate-600 mt-1">Share your experience and help others choose the perfect vehicle</p>
      </div>

      {completedBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No completed rentals</h3>
          <p className="text-slate-500">You can write a review after completing a rental.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Write a Review</h2>

              {completedBookings.length > 1 && (
                <div className="mb-4">
                  <label className="label">Select Booking</label>
                  <select value={selectedBooking} onChange={(e) => setSelectedBooking(e.target.value)} className="input">
                    <option value="">Choose a completed booking...</option>
                    {completedBookings.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.vehicle?.name || 'Vehicle'} - {new Date(b.dropoffDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {targetBooking && (
                <div className="card p-4 mb-6 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{targetBooking.vehicle?.name || 'Vehicle'}</p>
                      <p className="text-sm text-slate-500">Completed on {new Date(targetBooking.dropoffDate).toLocaleDateString()}</p>
                    </div>
                    <StatusBadge status={targetBooking.status} type="info" />
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="label">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating) ? 'text-amber-400 fill-current' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">
                    {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="input"
                  rows="5"
                  placeholder="Tell us about your experience with this vehicle..."
                />
              </div>

              <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Review
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Your Completed Rentals</h3>
              <div className="space-y-3">
                {completedBookings.map((booking) => (
                  <div key={booking._id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-900 text-sm">{booking.vehicle?.name || 'Vehicle'}</p>
                    <p className="text-xs text-slate-500">Completed: {new Date(booking.dropoffDate).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">Ref: #{booking._id?.slice(-8)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewsPage
