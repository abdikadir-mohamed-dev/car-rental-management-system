import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, Check, CheckCheck, Trash2, Calendar, CreditCard, FileText, AlertTriangle, RefreshCw } from 'lucide-react'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications([
      { id: 1, title: 'Booking Confirmed', message: 'Your booking for Toyota Camry has been confirmed.', type: 'booking', read: false, date: new Date().toISOString() },
      { id: 2, title: 'Payment Successful', message: 'Payment of KES 15,000 received.', type: 'payment', read: false, date: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, title: 'Return Reminder', message: 'Your rental ends tomorrow.', type: 'reminder', read: true, date: new Date(Date.now() - 172800000).toISOString() },
    ])
  }, [])

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    toast.success('Marked as read')
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success('Notification removed')
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-600 mt-1">Stay updated with your bookings and payments</p>
      </div>

      <div className="card p-2">
        <div className="flex gap-2">
          {['all', 'unread', 'booking', 'payment', 'reminder'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No notifications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`card p-4 flex items-start gap-4 ${notification.read ? 'opacity-75' : ''}`}>
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-medium text-slate-900">{notification.title}</h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{formatDateUtil(notification.date)}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                <div className="flex items-center gap-2 mt-3">
                  {!notification.read && (
                    <button onClick={() => markAsRead(notification.id)} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <CheckCheck className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notification.id)} className="text-xs text-danger hover:underline flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
