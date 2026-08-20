import CheckoutManagement from '../../components/staff/CheckoutManagement'

function StaffCheckoutPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Check-out</h1>
      </div>
      <CheckoutManagement />
    </div>
  )
}

export default StaffCheckoutPage
