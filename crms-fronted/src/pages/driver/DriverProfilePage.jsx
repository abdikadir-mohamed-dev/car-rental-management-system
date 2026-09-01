import { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getProfile } from '../../services/authService'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function DriverProfilePage() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)

      const response = await getProfile()
      const user = response.data.user

      setProfile(user)

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    } catch (error) {
      console.error('Failed to load driver profile:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to load profile'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      const token = localStorage.getItem('token')

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const updatedUser = response.data.user

      setProfile(updatedUser)

      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
      })

      setIsEditing(false)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)

      toast.error(
        error.response?.data?.message ||
        'Failed to update profile'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="card p-6 text-center text-slate-500">
        Unable to load profile.
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Profile
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your driver account information
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="card p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="label">
                Full Name
              </label>

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
              <label className="label">
                Email
              </label>

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
              <label className="label">
                Phone
              </label>

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

            <div className="flex justify-end gap-3 pt-4">

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)

                  setFormData({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                  })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}

                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>
          </form>
        ) : (
          <div className="space-y-6">

            {/* Profile Header */}
            <div className="flex items-center gap-4 pb-5 border-b border-slate-200">

              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">

                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}

              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {profile.name}
                </h2>

                <p className="text-sm text-slate-500">
                  Driver
                </p>

                <span className="badge badge-success mt-2">
                  Active
                </span>
              </div>

            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <ProfileItem
                label="Full Name"
                value={profile.name}
              />

              <ProfileItem
                label="Email"
                value={profile.email}
              />

              <ProfileItem
                label="Phone"
                value={profile.phone || 'Not provided'}
              />

              <ProfileItem
                label="Role"
                value={profile.role || 'driver'}
              />

            </div>

          </div>
        )}
      </div>
    </div>
  )
}

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-medium text-slate-900 mt-1">
        {value}
      </p>
    </div>
  )
}