import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import UserManagement from '../../components/admin/UserManagement'
import { getUsers, createStaff, createDriver, registerUser } from '../../services/adminService'

function ManageUsersPage() {
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUsers()
        const list = Array.isArray(data) ? data : (data.users || [])
        setUsers(list)
      } catch (err) {
        setError(err.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Phone must be exactly 10 digits'

    if (formData.role === 'staff' || formData.role === 'driver') {
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    try {
      let result
      if (formData.role === 'staff') {
        result = await createStaff({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isActive: true,
        })
      } else if (formData.role === 'driver') {
        result = await createDriver({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isActive: true,
        })
      } else {
        result = await registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          password: formData.password,
        })
      }

      const newUser = result.user || result
      setUsers((prev) => [newUser, ...prev])
      toast.success(`Account created successfully. Credentials sent to ${formData.email}`)
      setFormData({ name: '', email: '', phone: '', role: 'staff', password: '', confirmPassword: '' })
      setErrors({})
      setShowModal(false)
    } catch (err) {
      toast.error(err.message || err.response?.data?.error || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setFormData({ name: '', email: '', phone: '', role: 'staff', password: '', confirmPassword: '' })
    setErrors({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 hover:underline">Retry</button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-600 mt-1">View and manage all users</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">Add User</button>
      </div>
      <UserManagement users={users} setUsers={setUsers} />
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add User</h2>
              <p className="text-sm text-slate-500 mt-1">Create an account for staff or driver. Credentials will be sent to their email.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'border-danger' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'border-danger' : ''}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input ${errors.phone ? 'border-danger' : ''}`}
                  placeholder="0711000000"
                />
                {errors.phone && <p className="text-danger text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input capitalize"
                >
                  <option value="staff">Staff</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? 'border-danger' : ''}`}
                  placeholder="Min. 6 characters"
                />
                {errors.password && <p className="text-danger text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input ${errors.confirmPassword ? 'border-danger' : ''}`}
                  placeholder="Repeat password"
                />
                {errors.confirmPassword && <p className="text-danger text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
                <button type="button" onClick={handleClose} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage
