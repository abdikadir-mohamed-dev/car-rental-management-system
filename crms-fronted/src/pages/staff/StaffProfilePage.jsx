import { useState } from 'react'
import { User, Mail, Phone, Shield } from 'lucide-react'

const MOCK_USER = {
  name: 'Staff Member',
  email: 'staff@drivego.com',
  phone: '+254 712 345 678',
  role: 'staff',
  joined: '2025-05-10',
}

function StaffProfilePage() {
  const [user, setUser] = useState(MOCK_USER)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(MOCK_USER)

  const handleSave = () => {
    setUser(form)
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600">Manage your account details</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
            <p className="text-slate-600 capitalize">{user.role}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
                <User className="w-4 h-4 text-slate-500" />
                {user.name}
              </div>
            )}
          </div>
          <div>
            <label className="label">Email</label>
            {editing ? (
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
                <Mail className="w-4 h-4 text-slate-500" />
                {user.email}
              </div>
            )}
          </div>
          <div>
            <label className="label">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
                <Phone className="w-4 h-4 text-slate-500" />
                {user.phone}
              </div>
            )}
          </div>
          <div>
            <label className="label">Role</label>
            <div className="flex items-center gap-2 text-slate-900">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </div>
        {editing && (
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setEditing(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffProfilePage
