import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPayments } from '../../redux/slices/paymentSlice'
import PaymentHistory from '../../components/payment/PaymentHistory'

function MyPaymentsPage() {
  const dispatch = useDispatch()
  const { payments, loading } = useSelector((state) => state.payments)

  useEffect(() => {
    dispatch(fetchPayments({}))
  }, [dispatch])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
        <p className="text-slate-600 mt-1">View all your past transactions</p>
      </div>
      <PaymentHistory payments={payments} loading={loading} />
    </div>
  )
}

export default MyPaymentsPage
