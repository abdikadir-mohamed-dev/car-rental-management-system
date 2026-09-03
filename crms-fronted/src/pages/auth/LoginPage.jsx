import Login from '../../components/auth/Login'

function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/originals/97/5f/80/975f808899c1cf9b8080d3bc75449cc4.jpg')",
      }}
    >
      {/* Dark overlay - keeps the form readable */}
      <div className="absolute inset-0 bg-slate-950/70" />

      {/* Login content */}
      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-200">
            Sign in to your account
          </p>
        </div>

        <Login />
      </div>
    </div>
  )
}

export default LoginPage