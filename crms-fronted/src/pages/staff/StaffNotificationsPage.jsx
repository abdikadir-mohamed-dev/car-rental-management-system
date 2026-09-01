import { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import {
  getNotifications,
  markAllAsRead
} from '../../services/notificationService'


function StaffNotifications() {

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        setLoading(true)
        setError('')

        const data = await getNotifications()

        setNotifications(data)

      } catch (err) {

        console.error(
          'Failed to load notifications:',
          err
        )

        setError(
          err.response?.data?.message ||
          'Failed to load notifications'
        )

      } finally {

        setLoading(false)

      }
    }

    fetchNotifications()

  }, [])


  // ==========================================================
  // MARK ALL READ
  // ==========================================================

  const handleMarkAllRead = async () => {

    try {

      await markAllAsRead()

      setNotifications(
        notifications.map(notification => ({
          ...notification,
          read: true
        }))
      )

    } catch (err) {

      console.error(
        'Failed to mark notifications as read:',
        err
      )

    }

  }


  const unreadCount = notifications.filter(
    notification => !notification.read
  ).length


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="flex items-center justify-center py-12">

        <p className="text-slate-500">
          Loading notifications...
        </p>

      </div>
    )

  }


  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="text-slate-600">
            {unreadCount} unread notifications
          </p>

        </div>


        {unreadCount > 0 && (

          <button
            onClick={handleMarkAllRead}
            className="btn-secondary text-sm px-3 py-2 flex items-center gap-2"
          >

            <CheckCheck className="w-4 h-4" />

            Mark all read

          </button>

        )}

      </div>


      {/* ERROR */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">

          {error}

        </div>

      )}


      {/* NOTIFICATIONS */}

      <div className="space-y-3">

        {notifications.map((notification) => (

          <div
            key={notification.id}
            className={`card p-4 flex items-start gap-4 ${
              notification.read
                ? 'opacity-75'
                : 'border-l-4 border-l-primary'
            }`}
          >

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                notification.read
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-primary-light text-primary'
              }`}
            >

              <Bell className="w-5 h-5" />

            </div>


            <div className="flex-1">

              <div className="flex items-center justify-between">

                <h3 className="font-medium text-slate-900">
                  {notification.title}
                </h3>

                <span className="text-xs text-slate-500">

                  {notification.created_at
                    ? new Date(
                        notification.created_at
                      ).toLocaleString()
                    : ''
                  }

                </span>

              </div>


              <p className="text-sm text-slate-600 mt-1">

                {notification.message}

              </p>

            </div>

          </div>

        ))}


        {notifications.length === 0 && (

          <p className="text-center text-slate-500 py-8">
            No notifications.
          </p>

        )}

      </div>

    </div>

  )

}

export default StaffNotifications