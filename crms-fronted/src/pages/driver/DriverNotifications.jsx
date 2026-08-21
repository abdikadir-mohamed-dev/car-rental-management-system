import React from 'react'
import {
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, CheckCheck,
  AlertTriangle, CalendarCheck, Wallet, Wrench as WrenchIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialNotifications = [
  { id: 1, type: 'assignment', title: 'New assignment received', body: 'Pickup at JKIA Terminal 1, 09:30 AM.', time: '10 min ago', read: false },
  { id: 2, type: 'payment', title: 'Payout processed', body: 'KES 3,900 has been sent to your wallet.', time: '2 hours ago', read: false },
  { id: 3, type: 'maintenance', title: 'Maintenance reminder', body: 'Toyota Prado (KDA 221B) is due for service in 500 km.', time: '5 hours ago', read: false },
  { id: 4, type: 'alert', title: 'Booking cancelled', body: 'Kevin Njoroge cancelled booking BK-1029.', time: 'Yesterday', read: true },
  { id: 5, type: 'assignment', title: 'Assignment completed', body: 'Trip to Two Rivers Mall marked complete.', time: '2 days ago', read: true },
];

const iconByType = {
  assignment: { icon: CalendarCheck, bg: 'bg-blue-100 text-primary' },
  payment: { icon: Wallet, bg: 'bg-emerald-100 text-emerald-600' },
  maintenance: { icon: WrenchIcon, bg: 'bg-amber-100 text-amber-600' },
  alert: { icon: AlertTriangle, bg: 'bg-red-100 text-danger' },
};

export default function DriverNotificationsPage() {
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).count;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read')
  }
  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast.success('Notification marked as read')
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-sm text-slate-500">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
            {notifications.map((n) => {
              const { icon: Icon, bg } = iconByType[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl transition-colors ${
                    n.read ? 'bg-white' : 'bg-blue-50/60 hover:bg-blue-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${n.read ? 'text-slate-700 font-medium' : 'text-slate-900 font-semibold'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                </button>
              );
            }            )}
          </div>
        </div>
  )
}