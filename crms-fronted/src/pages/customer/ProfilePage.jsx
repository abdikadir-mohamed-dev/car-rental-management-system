import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, updateProfile } from '../../redux/slices/userSlice'
import toast from 'react-hot-toast'

function ProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading } = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully')
        setIsEditing(false)
      })
      .catch((err) => toast.error(err))
  }

  if (loading) return <div className="flex items-center justify-center min-h-[200px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account settings</p>
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
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
