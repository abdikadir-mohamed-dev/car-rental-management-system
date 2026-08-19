import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { validateRequired, validateEmail } from '../../utils/validation'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!validateRequired(formData.name)) newErrors.name = 'Name is required'
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required'
    if (!validateRequired(formData.message)) newErrors.message = 'Message is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    toast.success('Message sent successfully!')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">Get in touch with our team</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input ${errors.name ? 'border-danger' : ''}`}
                  />
                  {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input ${errors.email ? 'border-danger' : ''}`}
                  />
                  {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`input ${errors.message ? 'border-danger' : ''}`}
                  />
                  {errors.message && <p className="text-danger text-sm mt-1">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Info</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p className="text-slate-600">info@drivego.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Address</h3>
                    <p className="text-slate-600">123 Main Street<br />City, State 12345</p>
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

export default ContactPage
