import Register from '../../components/auth/Register'

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-slate-400">Join DriveGo today</p>
        </div>
        <Register />
      </div>
    </div>
  )
}

export default RegisterPage
