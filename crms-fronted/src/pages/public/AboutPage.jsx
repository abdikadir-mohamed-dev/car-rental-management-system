import { Shield, DollarSign, Clock, Users, Car, Award } from 'lucide-react'

function AboutPage() {
  return (
    <div>
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About DriveGo</h1>
          <p className="text-xl text-slate-300">Revolutionizing car rental with technology and trust</p>
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
              <p className="text-slate-600 mb-6">
                We believe in providing a seamless, transparent, and efficient rental experience for everyone involved. Our system is built with the latest technology to ensure reliability and scalability.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Reliable vehicles</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Affordable pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Easy online booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">24/7 customer support</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">10K+</h3>
                <p className="text-slate-600">Happy Customers</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Car className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">500+</h3>
                <p className="text-slate-600">Vehicles</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">24/7</h3>
                <p className="text-slate-600">Support</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900">100%</h3>
                <p className="text-slate-600">Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About DriveGo</h2>
              <p className="text-slate-600 mb-4">
                DriveGo makes car rental simple, convenient, and reliable. We provide a seamless platform for customers to discover, book, and enjoy premium vehicles.
              </p>
              <p className="text-slate-600 mb-6">
                With a wide selection of vehicles, competitive pricing, and exceptional customer support, we are your trusted partner for every journey.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Reliable Vehicles</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Affordable Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Easy Online Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">24/7 Support</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Choose DriveGo</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Wide Selection</h4>
                    <p className="text-sm text-slate-600">Choose from economy cars to luxury vehicles.</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Best Prices</h4>
                    <p className="text-sm text-slate-600">Competitive rates and great offers.</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Easy Booking</h4>
                    <p className="text-sm text-slate-600">Book your car in just a few simple steps.</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">24/7 Support</h4>
                    <p className="text-sm text-slate-600">We are here to help whenever you need us.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
