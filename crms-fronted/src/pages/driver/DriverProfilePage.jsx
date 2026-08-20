import React from 'react'
import {
  Car, Users, Wrench, BarChart2, Bell, User, Power,
  ShipWheel, ChevronDown, DollarSign, Mail, Phone,
  Route, Edit2, Save, X, Shield, Star, Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const initialProfile = {
  name: 'James Driver',
  email: 'james.driver@drivego.com',
  phone: '+254 712 345 678',
  role: 'Driver',
  licenseNo: 'DL-2291-KE',
  joined: 'Mar 2024',
};

const stats = [
  { label: 'Total Trips', value: 642 },
  { label: 'Rating', value: '4.9' },
  { label: 'Years Active', value: 2 },
];

export default function DriverProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState(initialProfile);
  const [formData, setFormData] = React.useState(initialProfile);
  const [saved, setSaved] = React.useState(false);

  const startEditing = () => {
    setFormData(profile);
    setIsEditing(true);
    setSaved(false);
  };

  const cancelEditing = () => {
    setFormData(profile);
    setIsEditing(false);
    toast.success('Editing cancelled')
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);
    setSaved(true);
    toast.success('Profile updated successfully')
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {saved && (
        <div className="bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-3 rounded-lg">
          Profile updated successfully.
        </div>
      )}

          {/* Profile header card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
              <User size={28} className="text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-slate-800">{profile.name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <Shield size={14} />
                {profile.role} · License {profile.licenseNo}
              </p>
            </div>
            <div className="flex gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
                    {s.label === 'Rating' && <Star size={16} className="text-amber-400 fill-amber-400" />}
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Details / edit form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">License Number</label>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-800">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-800">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">License Number</p>
                    <p className="text-sm font-medium text-slate-800">{profile.licenseNo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Joined</p>
                    <p className="text-sm font-medium text-slate-800">{profile.joined}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
  );
}