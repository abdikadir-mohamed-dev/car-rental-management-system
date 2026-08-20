import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, updateProfile } from '../../redux/slices/userSlice'
import toast from 'react-hot-toast'
import Loader from '../../components/common/Loader'

function StaffProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading, error } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [editingFormData, setEditingFormData] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const startEditing = () => {
    setEditingFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setEditingFormData(null)
    setIsEditing(false)
  }

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleChange = (e) => {
    setEditingFormData({ ...editingFormData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await dispatch(updateProfile(editingFormData)).unwrap()
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error(error || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !profile) return <Loader />

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        {!isEditing && (
          <button onClick={startEditing} className="btn-primary">
            Edit Profile
          </button>
        )}
      </div>

      <div className="card p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={editingFormData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={editingFormData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={editingFormData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={cancelEditing}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-medium text-slate-900">{profile?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{profile?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{profile?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <p className="font-medium text-slate-900 capitalize">{profile?.role || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffProfilePage
