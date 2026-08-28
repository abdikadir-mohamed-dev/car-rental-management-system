import { useState, useEffect } from 'react'
import { Search, Mail, Phone } from 'lucide-react'
import { getStaffCustomers } from '../../services/staffService'

function CustomerManagement() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getStaffCustomers()
        setCustomers(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Failed to load customers')
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  )

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
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-600">ID</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Phone</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">License No.</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Total Rentals</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-900">#{customer._id}</td>
                <td className="py-3 px-4 text-slate-600 font-medium">{customer.name}</td>
                <td className="py-3 px-4 text-slate-600">{customer.email}</td>
                <td className="py-3 px-4 text-slate-600">{customer.phone}</td>
                <td className="py-3 px-4 text-slate-600">{customer.licenseNumber}</td>
                <td className="py-3 px-4 text-slate-600">{customer.totalRentals}</td>
                <td className="py-3 px-4 text-slate-600">{customer.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <p className="text-center text-slate-500 py-8">No customers found.</p>
        )}
      </div>
    </div>
  )
}

export default CustomerManagement
