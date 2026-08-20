import { Menu, Bell, Search, User } from 'lucide-react'
import { useState } from 'react'

function CustomerHeader({ onToggleSidebar, unreadNotifications = 0 }) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">Customer Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            {showSearch && (
              <div className="absolute inset-0 bg-white z-40 flex items-center px-4">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search bookings, vehicles..."
                  className="w-full py-2 pl-10 pr-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button onClick={() => setShowSearch(false)} className="ml-4 p-2 hover:bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <button onClick={() => setShowSearch(!showSearch)} className="p-2 hover:bg-slate-100 rounded-lg hidden sm:flex">
              <Search className="w-5 h-5 text-slate-600" />
            </button>

            <button className="p-2 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              )}
            </button>

            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Customer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default CustomerHeader
