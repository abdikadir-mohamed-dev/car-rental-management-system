import { useState } from 'react'
import toast from 'react-hot-toast'

function AdminProfilePage() {
  const [admin, setAdmin] = useState({
    name: 'Admin User',
    email: 'admin@drivego.com',
    role: 'admin',
    phone: '+254 700 000 000',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...admin })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setAdmin(formData)
    setIsEditing(false)
    toast.success('Admin profile updated successfully')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Profile</h1>
          <p className="text-slate-600 mt-1">Manage your admin account settings</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary">Edit Profile</button>
        )}
      </div>
      <div className="card max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="label">Role</label>
            <input
              type="text"
              value={formData.role}
              className="input capitalize"
              disabled
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              disabled={!isEditing}
            />
          </div>
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1">Save Changes</button>
              <button type="button" onClick={() => { setFormData({ ...admin }); setIsEditing(false) }} className="btn-secondary flex-1">Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AdminProfilePage
