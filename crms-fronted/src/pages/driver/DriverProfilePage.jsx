import { useState } from 'react'
import { User, Mail, Phone, Car, Shield, Calendar, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_DRIVER_PROFILE = {
  name: 'James Kariuki',
  email: 'james.kariuki@drivego.com',
  phone: '+254 712 345 678',
  role: 'Driver',
  licenseNumber: 'DLN-2020-7894',
  licenseExpiry: '2027-05-15',
  experience: '5 years',
  rating: 4.9,
  totalTrips: 1240,
  status: 'Active',
}

function DriverProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(MOCK_DRIVER_PROFILE)
  const [formData, setFormData] = useState({ ...MOCK_DRIVER_PROFILE })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setProfile(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      <div className="card p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-9"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input pl-9"
                />
              </div>
            </div>
            <div>
              <label className="label">License Number</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="input pl-9"
                />
              </div>
            </div>
            <div>
              <label className="label">License Expiry</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  className="input pl-9"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({ ...profile })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-medium text-slate-900">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{profile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="font-medium text-slate-900 capitalize">{profile.role}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">License Number</p>
                <p className="font-medium text-slate-900">{profile.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">License Expiry</p>
                <p className="font-medium text-slate-900">{profile.licenseExpiry}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Experience</p>
                <p className="font-medium text-slate-900">{profile.experience}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Rating</p>
                <p className="font-medium text-slate-900">⭐ {profile.rating}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Trips</p>
                <p className="font-medium text-slate-900">{profile.totalTrips.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <span className="badge badge-success">{profile.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverProfilePage