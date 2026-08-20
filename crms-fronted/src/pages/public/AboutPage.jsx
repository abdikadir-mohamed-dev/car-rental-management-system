import { Users, Award, Clock, Shield } from 'lucide-react'

function AboutPage() {
  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About DriveGo</h1>
          <p className="text-xl text-blue-100">Revolutionizing car rental with technology and trust</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 mb-4">
                At DriveGo, we are dedicated to revolutionizing the car rental industry through technology. Our platform simplifies vehicle management, booking, and operations for rental companies, staff, and customers alike.
              </p>
              <p className="text-slate-600">
                We believe in providing a seamless, transparent, and efficient rental experience for everyone involved. Our system is built with the latest technology to ensure reliability and scalability.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="card text-center p-6">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">10K+</h3>
                <p className="text-slate-600">Happy Customers</p>
              </div>
              <div className="card text-center p-6">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">500+</h3>
                <p className="text-slate-600">Vehicles</p>
              </div>
              <div className="card text-center p-6">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">24/7</h3>
                <p className="text-slate-600">Support</p>
              </div>
              <div className="card text-center p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">100%</h3>
                <p className="text-slate-600">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
