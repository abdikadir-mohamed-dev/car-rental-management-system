import { useState } from 'react'
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  BookOpen,
  FileQuestion,
  Send,
  ChevronRight,
  CreditCard,
  FileText,
  Shield,
  Car,
} from 'lucide-react'
import toast from 'react-hot-toast'

const faqs = [
  {
    question: 'How do I book a vehicle?',
    answer: 'Browse our vehicle collection, select your dates and locations, then click "Book Now" to complete your reservation.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa, credit/debit cards, and bank transfers. Payment is required at the time of booking.',
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes, you can modify or cancel your booking up to 48 hours before the pickup time. Cancellation fees may apply.',
  },
  {
    question: 'What do I need to pick up my vehicle?',
    answer: 'You need a valid driver\'s license, national ID/passport, and the booking confirmation. International renters may need an international driving permit.',
  },
  {
    question: 'Is there a mileage limit?',
    answer: 'Most rentals include unlimited mileage. For specific vehicles or special offers, mileage limits may apply and will be clearly stated.',
  },
  {
    question: 'What is the fuel policy?',
    answer: 'Vehicles are provided with a full tank and should be returned with a full tank. Fuel is not included in the rental price.',
  },
]

function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('faq')
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Your message has been sent! We will get back to you within 24 hours.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
        <p className="text-slate-600 mt-1">How can we help you today?</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {['faq', 'contact', 'resources'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'faq' ? 'FAQ' : tab === 'contact' ? 'Contact Us' : 'Resources'}
          </button>
        ))}
      </div>

      {activeTab === 'faq' && (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-primary" />
                {faq.question}
              </h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="label">Subject</label>
                <input type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="input" rows="5" required />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">+254 700 123 456</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">support@drivego.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Live Chat</p>
                    <p className="font-medium text-slate-900">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Getting Started', desc: 'Learn how to create an account and make your first booking.', icon: BookOpen },
            { title: 'Booking Guide', desc: 'Step-by-step guide to booking and managing your reservations.', icon: FileQuestion },
            { title: 'Payment Help', desc: 'Information about payment methods, invoices, and receipts.', icon: CreditCard },
            { title: 'Cancellation Policy', desc: 'Understand our cancellation and refund policies.', icon: FileText },
            { title: 'Insurance & Protection', desc: 'Learn about our insurance options and coverage details.', icon: Shield },
            { title: 'Vehicle Care', desc: 'Guidelines for taking care of your rental vehicle.', icon: Car },
          ].map((resource, idx) => (
            <div key={idx} className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mb-3">
                <resource.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{resource.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{resource.desc}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Learn more <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HelpSupportPage
