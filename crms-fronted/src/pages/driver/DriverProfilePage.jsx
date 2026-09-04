import { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getProfile,
  changePassword,
} from '../../services/authService'

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function DriverProfilePage() {
  const [profile, setProfile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [passwordErrors, setPasswordErrors] = useState({})

  // ============================================================
  // LOAD PROFILE
  // ============================================================

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
      console.error(
        'Failed to load driver profile:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to load profile'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  // ============================================================
  // PROFILE FORM
  // ============================================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ============================================================
  // UPDATE PROFILE
  // ============================================================

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
      console.error(
        'Failed to update profile:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to update profile'
      )
    } finally {
      setSaving(false)
    }
  }

  // ============================================================
  // PASSWORD FORM
  // ============================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // ============================================================
  // VALIDATE PASSWORD
  // ============================================================

  const validatePassword = () => {
    const errors = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword =
        'Current password is required'
    }

    if (!passwordData.newPassword) {
      errors.newPassword =
        'New password is required'
    } else if (
      passwordData.newPassword.length < 6
    ) {
      errors.newPassword =
        'Password must be at least 6 characters'
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword =
        'Please confirm your new password'
    } else if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      errors.confirmPassword =
        'Passwords do not match'
    }

    setPasswordErrors(errors)

    return Object.keys(errors).length === 0
  }

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!validatePassword()) {
      return
    }

    try {
      setChangingPassword(true)

      await changePassword({
        currentPassword:
          passwordData.currentPassword,
        newPassword:
          passwordData.newPassword,
      })

      toast.success(
        'Password changed successfully'
      )

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setPasswordErrors({})
      setShowPasswordModal(false)
    } catch (error) {
      console.error(
        'Failed to change password:',
        error
      )

      toast.error(
        error.response?.data?.message ||
        'Failed to change password'
      )
    } finally {
      setChangingPassword(false)
    }
  }

  // ============================================================
  // CLOSE PASSWORD MODAL
  // ============================================================

  const closePasswordModal = () => {
    if (changingPassword) return

    setShowPasswordModal(false)

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

    setPasswordErrors({})
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (!profile) {
    return (
      <div className="card p-6 text-center text-slate-500">
        Unable to load profile.
      </div>
    )
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ========================================================
          HEADER
      ======================================================== */}

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

      {/* ========================================================
          PROFILE CARD
      ======================================================== */}

      <div className="card p-6">

        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}

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

            {/* EMAIL */}

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

            {/* PHONE */}

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

            {/* BUTTONS */}

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

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>
          </form>

        ) : (

          <div className="space-y-6">

            {/* PROFILE HEADER */}

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

            {/* PROFILE INFORMATION */}

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
                value={
                  profile.phone ||
                  'Not provided'
                }
              />

              <ProfileItem
                label="Role"
                value={
                  profile.role ||
                  'driver'
                }
              />

            </div>

          </div>
        )}
      </div>

      {/* ========================================================
          SECURITY CARD
      ======================================================== */}

      <div className="card p-6">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Security
              </h2>

              <p className="text-sm text-slate-500">
                Keep your account password secure
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="btn-secondary"
          >
            Change Password
          </button>

        </div>
      </div>

      {/* ========================================================
          CHANGE PASSWORD MODAL
      ======================================================== */}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b border-slate-200">

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Change Password
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update your account password
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={changingPassword}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleChangePassword}
              className="p-6 space-y-5"
            >

              {/* CURRENT PASSWORD */}

              <div>
                <label className="label">
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={handlePasswordChange}
                  className={`input ${
                    passwordErrors.currentPassword
                      ? 'border-danger'
                      : ''
                  }`}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                {passwordErrors.currentPassword && (
                  <p className="text-danger text-sm mt-1">
                    {
                      passwordErrors.currentPassword
                    }
                  </p>
                )}
              </div>

              {/* NEW PASSWORD */}

              <div>
                <label className="label">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={handlePasswordChange}
                  className={`input ${
                    passwordErrors.newPassword
                      ? 'border-danger'
                      : ''
                  }`}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                />

                {passwordErrors.newPassword && (
                  <p className="text-danger text-sm mt-1">
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label className="label">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={handlePasswordChange}
                  className={`input ${
                    passwordErrors.confirmPassword
                      ? 'border-danger'
                      : ''
                  }`}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />

                {passwordErrors.confirmPassword && (
                  <p className="text-danger text-sm mt-1">
                    {
                      passwordErrors.confirmPassword
                    }
                  </p>
                )}
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="btn-primary flex items-center gap-2"
                >
                  {changingPassword && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}

                  {changingPassword
                    ? 'Changing...'
                    : 'Change Password'}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// PROFILE ITEM
// ============================================================

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