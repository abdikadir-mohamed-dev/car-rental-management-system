import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markAsRead } from '../../redux/slices/notificationSlice'
import { Bell, Check, CheckCheck, Trash2, Calendar, CreditCard, FileText, AlertTriangle, RefreshCw } from 'lucide-react'
import { formatDate as formatDateUtil } from '../../utils/formatDate'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

function NotificationsPage() {
  const dispatch = useDispatch()
  const { notifications = [], unreadCount = 0, loading } = useSelector((state) => state.notifications)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking':
        return Calendar
      case 'payment':
        return CreditCard
      case 'agreement':
        return FileText
      case 'reminder':
        return Bell
      case 'refund':
        return RefreshCw
      default:
        return AlertTriangle
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking':
        return 'bg-blue-100 text-blue-600'
      case 'payment':
        return 'bg-emerald-100 text-emerald-600'
      case 'agreement':
        return 'bg-primary-light text-primary'
      case 'reminder':
        return 'bg-amber-100 text-amber-600'
      case 'refund':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id))
      .unwrap()
      .catch((err) => toast.error(err))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => {
              notifications.forEach((n) => { if (!n.read) handleMarkAsRead(n._id) })
              toast.success('All notifications marked as read')
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'unread', 'booking', 'payment', 'reminder', 'agreement', 'refund'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
          <p className="text-slate-500">You're all caught up! No new notifications to show.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            return (
              <div
                key={notification._id}
                className={`card p-4 transition-colors ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900">{notification.title || 'Notification'}</p>
                        <p className="text-sm text-slate-500 mt-1">{notification.message || 'No details available'}</p>
                        <p className="text-xs text-slate-400 mt-2">{formatDateUtil(notification.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 hover:bg-slate-100 rounded-lg"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        <span className={`badge ${!notification.read ? 'badge-success' : 'badge-gray'}`}>
                          {notification.read ? 'Read' : 'New'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
