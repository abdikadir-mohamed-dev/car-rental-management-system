import { useState, useEffect } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService'
import { useSelector } from 'react-redux'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getNotifications(user?.id)
        const list = (data && data.notifications) ? data.notifications : (Array.isArray(data) ? data : [])
        setNotifications(list.map(n => ({ ...n, id: n._id || n.id, time: n.time || n.createdAt })))
      } catch (err) {
        setError(err.message || 'Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }
    loadNotifications()
  }, [user?.id])

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    } catch {
      // ignore
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch {
      // ignore
    }
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">Stay updated with your bookings</p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="btn-secondary flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">You're all caught up</h3>
          <p className="text-slate-600">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card p-4 flex items-start gap-4 ${!notification.read ? 'border-blue-200 bg-blue-50/50' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.type === 'success' ? 'bg-emerald-100' :
                notification.type === 'promo' ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                <Bell className={`w-5 h-5 ${
                  notification.type === 'success' ? 'text-success' :
                  notification.type === 'promo' ? 'text-primary' : 'text-slate-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-slate-900">{notification.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
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
