import { useState } from 'react'
import { Search, Mail, Phone } from 'lucide-react'

const MOCK_CUSTOMERS = [
  { _id: 'CUS-101', name: 'Alice Mwangi', email: 'alice@example.com', phone: '+254 712 345 678', licenseNumber: 'DL-88231', totalRentals: 12, joined: '2025-06-15' },
  { _id: 'CUS-102', name: 'Brian Otieno', email: 'brian@example.com', phone: '+254 723 456 789', licenseNumber: 'DL-99102', totalRentals: 8, joined: '2025-08-22' },
  { _id: 'CUS-103', name: 'Grace Njeri', email: 'grace@example.com', phone: '+254 734 567 890', licenseNumber: 'DL-77412', totalRentals: 5, joined: '2026-01-10' },
  { _id: 'CUS-104', name: 'David Kipchoge', email: 'david@example.com', phone: '+254 745 678 901', licenseNumber: 'DL-66203', totalRentals: 3, joined: '2026-03-05' },
  { _id: 'CUS-105', name: 'Mary Wanjiku', email: 'mary@example.com', phone: '+254 756 789 012', licenseNumber: 'DL-55391', totalRentals: 15, joined: '2024-11-30' },
]

function CustomerManagement() {
  const [customers] = useState(MOCK_CUSTOMERS)
  const [search, setSearch] = useState('')

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  )

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
