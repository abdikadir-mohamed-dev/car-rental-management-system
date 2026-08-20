import React from 'react'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, CheckCheck,
  AlertTriangle, CalendarCheck, Wallet, Wrench as WrenchIcon
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'My Assignments', icon: ClipboardList },
  { label: 'Trips', icon: Route },
  { label: 'Earnings', icon: DollarSign },
  { label: 'Bookings', icon: Calendar },
  { label: 'Check-out', icon: LogOut },
  { label: 'Check-in', icon: LogIn },
  { label: 'Vehicles', icon: Car },
  { label: 'Customers', icon: Users },
  { label: 'Maintenance', icon: Wrench },
  { label: 'Reports', icon: BarChart2 },
  { label: 'Notifications', icon: Bell },
  { label: 'Profile', icon: User },
  { label: 'Logout', icon: Power },
];

const initialNotifications = [
  { id: 1, type: 'assignment', title: 'New assignment received', body: 'Pickup at JKIA Terminal 1, 09:30 AM.', time: '10 min ago', read: false },
  { id: 2, type: 'payment', title: 'Payout processed', body: 'KES 3,900 has been sent to your wallet.', time: '2 hours ago', read: false },
  { id: 3, type: 'maintenance', title: 'Maintenance reminder', body: 'Toyota Prado (KDA 221B) is due for service in 500 km.', time: '5 hours ago', read: false },
  { id: 4, type: 'alert', title: 'Booking cancelled', body: 'Kevin Njoroge cancelled booking BK-1029.', time: 'Yesterday', read: true },
  { id: 5, type: 'assignment', title: 'Assignment completed', body: 'Trip to Two Rivers Mall marked complete.', time: '2 days ago', read: true },
];

const iconByType = {
  assignment: { icon: CalendarCheck, bg: 'bg-blue-100 text-blue-600' },
  payment: { icon: Wallet, bg: 'bg-emerald-100 text-emerald-600' },
  maintenance: { icon: WrenchIcon, bg: 'bg-amber-100 text-amber-600' },
  alert: { icon: AlertTriangle, bg: 'bg-rose-100 text-rose-600' },
};

export default function DriverNotificationsPage() {
  const [active, setActive] = React.useState('Notifications');
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="bg-slate-100 h-screen overflow-hidden flex">
      <div className="bg-[#0D1B2A] w-56 h-screen overflow-y-auto text-slate-400 flex-shrink-0">
        <div className="flex items-center gap-2 text-xl font-bold text-white py-6 px-5">
          <ShipWheel size={22} className="text-blue-500" />
          DriveGo
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left relative
                  ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon size={18} />
                {label}
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <nav className="bg-white flex items-center justify-end gap-2 px-6 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">James Driver</span>
          <ChevronDown size={16} className="text-slate-400" />
        </nav>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
              <p className="text-sm text-slate-500">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
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
                    n.read ? 'bg-white' : 'bg-emerald-50/60 hover:bg-emerald-50'
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
                      {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}