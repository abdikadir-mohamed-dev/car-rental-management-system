import CustomerManagement from '../../components/staff/CustomerManagement'

function StaffCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      </div>
      <CustomerManagement />
    </div>
  )
}

export default StaffCustomersPage
