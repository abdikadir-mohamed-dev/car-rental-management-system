import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { processPayment } from '../../redux/slices/paymentSlice'
import toast from 'react-hot-toast'
import { CreditCard, Lock } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

function PaymentForm({ booking, onClose }) {
  const [formData, setFormData] = useState({
    bookingId: booking._id,
    amount: booking.totalAmount,
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })
  const [errors, setErrors] = useState({})
  const { loading } = useSelector((state) => state.payments)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!formData.cvv) newErrors.cvv = 'CVV is required'
    if (!formData.cardName) newErrors.cardName = 'Cardholder name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch(processPayment({ ...formData, bookingId: booking._id }))
      .unwrap()
      .then(() => {
        toast.success('Payment processed successfully!')
        onClose?.()
      })
      .catch((err) => toast.error(err))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <span className="text-2xl text-slate-500">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-primary-light p-4 rounded-lg flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold text-slate-900">Booking #{booking._id?.slice(-8)}</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(booking.totalAmount)}</p>
            </div>
          </div>
          
          <div>
            <label className="label">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {['card', 'mpesa', 'paypal'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData({ ...formData, method })}
                  className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                    formData.method === method
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {method === 'mpesa' ? 'M-Pesa' : method}
                </button>
              ))}
            </div>
          </div>
          
          {formData.method === 'card' && (
            <>
              <div>
                <label className="label">Cardholder Name</label>
                <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} className={`input ${errors.cardName ? 'border-danger' : ''}`} />
                {errors.cardName && <p className="text-danger text-sm mt-1">{errors.cardName}</p>}
              </div>
              <div>
                <label className="label">Card Number</label>
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" className={`input ${errors.cardNumber ? 'border-danger' : ''}`} />
                {errors.cardNumber && <p className="text-danger text-sm mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry Date</label>
                  <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" className={`input ${errors.expiryDate ? 'border-danger' : ''}`} />
                  {errors.expiryDate && <p className="text-danger text-sm mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" className={`input ${errors.cvv ? 'border-danger' : ''}`} />
                  {errors.cvv && <p className="text-danger text-sm mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </>
          )}
          
          {formData.method === 'mpesa' && (
            <div>
              <label className="label">M-Pesa Phone Number</label>
              <input type="tel" placeholder="+254 700 000 000" className="input" />
            </div>
          )}
          
          {formData.method === 'paypal' && (
            <div>
              <label className="label">PayPal Email</label>
              <input type="email" placeholder="your@email.com" className="input" />
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Lock className="w-4 h-4" />
            Payments are secure and encrypted
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Processing...' : `Pay ${formatCurrency(booking.totalAmount)}`}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm
