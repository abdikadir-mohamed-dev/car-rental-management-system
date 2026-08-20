import { Link } from 'react-router-dom'
import { Car, Phone, Mail, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-sidebar text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">DriveGo</span>
            </div>
            <p className="text-slate-400 text-sm">
              Your trusted car rental management system. Book, manage, and track vehicles with ease.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/vehicles" className="text-slate-400 hover:text-white transition-colors text-sm">Browse Cars</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-slate-400 text-sm">Car Rental</span></li>
              <li><span className="text-slate-400 text-sm">Vehicle Management</span></li>
              <li><span className="text-slate-400 text-sm">Driver Services</span></li>
              <li><span className="text-slate-400 text-sm">Corporate Solutions</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4" />
                info@drivego.com
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                123 Main St, City
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p> DriveGo Car Rental Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
