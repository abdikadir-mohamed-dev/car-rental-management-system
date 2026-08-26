import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Edit, Trash2, Search } from 'lucide-react'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { getUsers, updateUser, deleteUser } from '../../services/adminService'

function UserManagement({ users: externalUsers, setUsers: externalSetUsers, onEdit }) {
  const [internalUsers, setInternalUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'customer' })
  const [deleteId, setDeleteId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const users = externalUsers || internalUsers
  const setUsers = externalSetUsers || setInternalUsers

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await getUsers()
      setUsers(response.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!externalUsers) {
      loadUsers()
    } else {
      setLoading(false)
    }
  }, [externalUsers])

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
    onEdit?.(user)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await updateUser(editingUser.id, formData)
      setUsers(users.map(u => u.id === editingUser.id ? response.data : u))
      toast.success('User updated')
      setEditingUser(null)
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false)
    if (deleteId) {
      try {
        await deleteUser(deleteId)
        setUsers(users.filter(u => u.id !== deleteId))
        toast.success('User deleted')
      } catch {
        toast.error('Failed to delete user')
      }
      setDeleteId(null)
    }
  }

  const handleDeleteCancel = () => {
    setConfirmOpen(false)
    setDeleteId(null)
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Role</th>
                <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id || user._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">{user.name}</td>
                  <td className="py-3 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3 px-4 text-slate-600">{user.phone || 'N/A'}</td>
                  <td className="py-3 px-4 capitalize text-slate-600">{user.role}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(user)} className="p-2 text-primary hover:bg-primary-light rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(user.id || user._id)} className="p-2 text-danger hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p className="text-center text-slate-500 py-8">No users found.</p>
          )}
        </div>
      )}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Edit User</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="label">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input capitalize">
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setEditingUser(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Yes, Delete"
      />
    </div>
  )
}

export default UserManagement
