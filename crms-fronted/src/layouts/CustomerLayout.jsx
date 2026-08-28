import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import CustomerSidebar from '../components/common/CustomerSidebar'
import CustomerHeader from '../components/common/CustomerHeader'
import { getUnreadCount } from '../services/notificationService'
import { useSelector } from 'react-redux'

function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const data = await getUnreadCount()
        setUnreadCount(data.count || 0)
      } catch {
        // ignore
      }
    }
    loadUnread()
  }, [user?.id])

  return (
    <div className="min-h-screen flex bg-background">
      <CustomerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <CustomerHeader onMenuClick={() => setSidebarOpen(true)} unreadNotifications={unreadCount} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout
