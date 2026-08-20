import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  LayoutGrid, ClipboardList, Calendar, LogOut, LogIn,
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Route, Search, Fuel, Gauge
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/driver/dashboard', icon: LayoutGrid },
  { label: 'My Assignments', to: '/driver/assignments', icon: ClipboardList },
  { label: 'Trips', to: '/driver/trips', icon: Route },
  { label: 'Earnings', to: '/driver/earnings', icon: DollarSign },
  { label: 'Bookings', to: '/driver/bookings', icon: Calendar },
  { label: 'Vehicles', to: '/driver/vehicles', icon: Car },
  { label: 'Customers', to: '/driver/customers', icon: Users },
  { label: 'Maintenance', to: '/driver/maintenance', icon: Wrench },
  { label: 'Reports', to: '/driver/reports', icon: BarChart2 },
  { label: 'Notifications', to: '/driver/notifications', icon: Bell },
  { label: 'Profile', to: '/driver/profile', icon: User },
]

export default function DriverLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    toast.success('Logged out successfully')
    navigate('/auth/login')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
          <ShipWheel className="text-emerald-600" size={24} />
          <span className="text-lg font-bold text-slate-800">DriveGo</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
