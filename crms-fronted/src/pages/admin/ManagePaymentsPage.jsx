import PaymentManagement from '../../components/admin/PaymentManagement'

function ManagePaymentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Manage Payments</h1>
        <p className="text-slate-600 mt-1">View and manage all payments</p>
      </div>
      <PaymentManagement />
    </div>
  )
}

export default ManagePaymentsPage
