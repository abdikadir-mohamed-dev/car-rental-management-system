import { useState } from 'react'
import UserManagement from '../../components/admin/UserManagement'

function ManageUsersPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-600 mt-1">View and manage all users</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">Add User</button>
      </div>
      <UserManagement />
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add User</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600">User creation form would go here.</p>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-primary flex-1">Add</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage
