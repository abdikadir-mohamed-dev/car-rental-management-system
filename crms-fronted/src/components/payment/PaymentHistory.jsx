import PaymentCard from './PaymentCard'

function PaymentHistory({ payments, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">No payment history found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {payments.map((payment) => (
        <PaymentCard key={payment._id} payment={payment} />
      ))}
    </div>
  )
}

export default PaymentHistory
