import React, { useEffect, useState } from 'react'
import {
  CalendarCheck,
  Wallet,
  AlertTriangle,
  CheckCheck,
  Bell,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/driverService'

const getNotificationIcon = (title = '') => {
  const text = title.toLowerCase()

  if (
    text.includes('assignment') ||
    text.includes('trip') ||
    text.includes('booking')
  ) {
    return {
      icon: CalendarCheck,
      bg: 'bg-blue-100 text-primary',
    }
  }

  if (text.includes('payment') || text.includes('payout')) {
    return {
      icon: Wallet,
      bg: 'bg-emerald-100 text-emerald-600',
    }
  }

  if (
    text.includes('cancel') ||
    text.includes('alert') ||
    text.includes('warning')
  ) {
    return {
      icon: AlertTriangle,
      bg: 'bg-red-100 text-danger',
    }
  }

  return {
    icon: Bell,
    bg: 'bg-slate-100 text-slate-600',
  }
}

const formatTime = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleString()
}

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)

      const data = await getNotifications()

      setNotifications(data)
    } catch (error) {
      console.error('Failed to load notifications:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to load notifications'
      )
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length

  const markRead = async (id) => {
    try {
      await markNotificationRead(id)

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to update notification'
      )
    }
  }

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead()

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      )

      toast.success('All notifications marked as read')
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to update notifications'
      )
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Notifications
          </h1>

          <p className="text-sm text-slate-500">
            {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="card p-6 text-center text-slate-500">
          Loading notifications...
        </div>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <div className="card p-8 text-center">
          <Bell className="w-10 h-10 mx-auto text-slate-300 mb-3" />

          <p className="font-medium text-slate-700">
            No notifications
          </p>

          <p className="text-sm text-slate-500 mt-1">
            You don't have any notifications yet.
          </p>
        </div>
      )}

      {/* Notifications */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const {
              icon: Icon,
              bg,
            } = getNotificationIcon(notification.title)

            return (
              <button
                key={notification.id}
                onClick={() =>
                  !notification.read &&
                  markRead(notification.id)
                }
                className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-colors ${
                  notification.read
                    ? 'bg-white'
                    : 'bg-blue-50/60 hover:bg-blue-50'
                }`}
              >

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2">

                    <p
                      className={`text-sm ${
                        notification.read
                          ? 'text-slate-700 font-medium'
                          : 'text-slate-900 font-semibold'
                      }`}
                    >
                      {notification.title}
                    </p>

                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}

                  </div>

                  <p className="text-sm text-slate-500 mt-0.5">
                    {notification.message}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {formatTime(notification.created_at)}
                  </p>

                </div>
              </button>
            )
          })}
        </div>
      )}

    </div>
  )
}