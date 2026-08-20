import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBookings } from '../../redux/slices/bookingSlice'
import { Link } from 'react-router-dom'
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import { BOOKING_STATUS } from '../../utils/constants'
import StatusBadge from '../../components/common/StatusBadge'
import BookingSummary from '../../components/booking/BookingSummary'
import Loader from '../../components/common/Loader'

function MyBookingsPage() {
  const dispatch = useDispatch()
  const { bookings = [], loading } = useSelector((state) => state.bookings)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    dispatch(fetchBookings({}))
  }, [dispatch])

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true
    return b.status === activeTab
  })

  const tabs = [
    { key: 'all', label: 'All', count: bookings.length },
    { key: BOOKING_STATUS.UPCOMING, label: 'Upcoming', count: bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.pickupDate) > new Date()).length },
    { key: BOOKING_STATUS.ACTIVE, label: 'Active', count: bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.pickupDate) <= new Date() && new Date(b.dropoffDate) >= new Date()).length },
    { key: BOOKING_STATUS.COMPLETED, label: 'Completed', count: bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length },
    { key: BOOKING_STATUS.CANCELLED, label: 'Cancelled', count: bookings.filter((b) => b.status === BOOKING_STATUS.CANCELLED).length },
  ]

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-600 mt-1">View and manage all your bookings</p>
      </div>

      <div className="border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.key ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-primary-light text-primary' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
          <p className="text-slate-500 mb-6">You don't have any bookings in this category.</p>
          <Link to="/customer/vehicles" className="btn-primary">Browse Vehicles</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingSummary key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookingsPage
