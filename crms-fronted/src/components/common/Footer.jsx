import { Link } from 'react-router-dom'
import { Car, Phone, Mail, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">DriveGo</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Your trusted car rental management system. Book, manage, and track vehicles with ease.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-xs font-bold">f</a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-xs font-bold">X</a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-xs font-bold">In</a>
              <a href="#" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-xs font-bold">Ig</a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                info@drivego.com
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                +254 700 000 000
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                Westlands, Nairobi, Kenya
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
