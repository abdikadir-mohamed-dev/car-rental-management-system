import { useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'

const MOCK_NOTIFICATIONS = [
  { _id: 'NTF-301', title: 'New Booking', message: 'Alice Mwangi booked Toyota RAV4 for Aug 20 - Aug 25', time: '2 mins ago', read: false },
  { _id: 'NTF-302', title: 'Upcoming Pickup', message: 'John Doe pickup scheduled for 09:00 AM', time: '15 mins ago', read: false },
  { _id: 'NTF-303', title: 'Check-in Completed', message: 'Jane Smith returned Honda CR-V successfully', time: '1 hour ago', read: true },
  { _id: 'NTF-304', title: 'Maintenance Alert', message: 'Toyota Camry flagged for tire replacement', time: '3 hours ago', read: true },
]

function StaffNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary text-sm px-3 py-2 flex items-center gap-2">
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`card p-4 flex items-start gap-4 ${notification.read ? 'opacity-75' : 'border-l-4 border-l-primary'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-slate-100 text-slate-500' : 'bg-primary-light text-primary'}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">{notification.title}</h3>
                <span className="text-xs text-slate-500">{notification.time}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <p className="text-center text-slate-500 py-8">No notifications.</p>
        )}
      </div>
    </div>
  )
}

export default StaffNotifications
