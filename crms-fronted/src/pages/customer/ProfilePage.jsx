import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { mockUsers } from '../../data/mockUsers'

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: mockUsers.customer.firstName,
    lastName: mockUsers.customer.lastName,
    email: mockUsers.customer.email,
    phone: mockUsers.customer.phone,
    address: mockUsers.customer.address,
    dateOfBirth: mockUsers.customer.dateOfBirth,
    licenseNumber: mockUsers.customer.licenseNumber,
    licenseType: mockUsers.customer.licenseType,
    licenseIssueDate: mockUsers.customer.licenseIssueDate,
    licenseExpiryDate: mockUsers.customer.licenseExpiryDate,
    licenseCountry: mockUsers.customer.licenseCountry,
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Profile updated successfully')
    setIsEditing(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-blue-600">
              {formData.firstName[0]}{formData.lastName[0]}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">{formData.firstName} {formData.lastName}</h2>
          <p className="text-slate-600">Customer</p>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Driver's License Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Type</label>
                  <input
                    type="text"
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="licenseIssueDate"
                      value={formData.licenseIssueDate}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="licenseExpiryDate"
                      value={formData.licenseExpiryDate}
                      onChange={handleChange}
                      className="input pl-9"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="licenseCountry"
                    value={formData.licenseCountry}
                    onChange={handleChange}
                    className="input"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex items-center gap-2 flex-1">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
