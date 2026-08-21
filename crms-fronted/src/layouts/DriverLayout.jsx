import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  LayoutGrid, ClipboardList, Route, DollarSign,
  Calendar, Car, Users, Wrench, BarChart2, Bell, User, LogOut, ShipWheel
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
      <aside className="fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-white transform transition-transform lg:translate-x-0 flex flex-col">
        <div className="flex items-center justify-between p-4 lg:hidden">
          <NavLink to="/" className="flex items-center gap-2" onClick={() => {}}>
            <ShipWheel className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">DriveGo</span>
          </NavLink>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2">
            <ShipWheel className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold text-white">DriveGo</span>
          </NavLink>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-hover">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-sidebar-hover hover:text-white rounded-lg transition-colors text-sm font-medium w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  )
}
