import { Outlet } from 'react-router-dom'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Outlet />
    </div>
  )
}

export default PublicLayout
