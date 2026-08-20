import ForgotPassword from '../../components/auth/ForgotPassword'

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="mt-2 text-slate-400">We'll send you a reset link</p>
        </div>
        <ForgotPassword />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
