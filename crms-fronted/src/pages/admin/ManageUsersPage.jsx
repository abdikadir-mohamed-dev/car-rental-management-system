import { useState } from 'react'
import toast from 'react-hot-toast'
import UserManagement from '../../components/admin/UserManagement'

function ManageUsersPage() {
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([
    { _id: 'U001', name: 'John Doe', email: 'john@example.com', role: 'customer', phone: '0711000000' },
    { _id: 'U002', name: 'Mary Wanjiku', email: 'mary@example.com', role: 'customer', phone: '0722000000' },
    { _id: 'U003', name: 'Peter Mwangi', email: 'peter@example.com', role: 'driver', phone: '0733000000' },
    { _id: 'U004', name: 'Ali Hassan', email: 'ali@example.com', role: 'customer', phone: '0744000000' },
    { _id: 'U005', name: 'James Kamau', email: 'james@example.com', role: 'staff', phone: '0755000000' },
    { _id: 'U006', name: 'Admin User', email: 'admin@drivego.com', role: 'admin', phone: '0766000000' },
  ])
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Phone must be exactly 10 digits'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    setTimeout(() => {
      const newUser = {
        _id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      }
      setUsers(prev => [newUser, ...prev])
      toast.success(`Account created successfully. Credentials sent to ${formData.email}`)
      setFormData({ name: '', email: '', phone: '', role: 'staff', password: '', confirmPassword: '' })
      setErrors({})
      setSubmitting(false)
      setShowModal(false)
    }, 800)
  }

  const handleClose = () => {
    setShowModal(false)
    setFormData({ name: '', email: '', phone: '', role: 'staff', password: '', confirmPassword: '' })
    setErrors({})
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
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
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
