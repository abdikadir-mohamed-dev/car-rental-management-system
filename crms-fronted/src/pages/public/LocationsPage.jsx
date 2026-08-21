import { MapPin } from 'lucide-react'

function LocationsPage() {
  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Locations</h1>
          <p className="text-xl text-blue-100">Find us at convenient locations near you</p>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Downtown Office', 'Airport Terminal', 'City Mall'].map((location) => (
              <div key={location} className="card p-6">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{location}</h3>
                <p className="text-slate-600 text-sm">123 Main Street, City, State 12345</p>
                <p className="text-slate-600 text-sm">Mon - Sun: 8:00 AM - 8:00 PM</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LocationsPage
